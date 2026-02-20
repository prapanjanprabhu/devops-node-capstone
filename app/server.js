const express = require("express");
const os = require("os");
const client = require("prom-client");

const app = express();

// ---- Config ----
const PORT = process.env.PORT || 3000;

// ---- Prometheus Metrics ----
client.collectDefaultMetrics({ prefix: "node_app_" });

const httpRequestsTotal = new client.Counter({
  name: "node_app_http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status"],
});

app.use((req, res, next) => {
  res.on("finish", () => {
    const route = req.route?.path || req.path || "unknown";
    httpRequestsTotal.inc({
      method: req.method,
      route,
      status: String(res.statusCode),
    });
  });
  next();
});

// ---- Routes ----
app.get("/", (req, res) => {
  res.status(200).json({
    message: "DevOps Node Capstone App is running ✅",
    hostname: os.hostname(),
    time: new Date().toISOString(),
  });
});

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// Prometheus scrape endpoint
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

// ---- Start ----
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});