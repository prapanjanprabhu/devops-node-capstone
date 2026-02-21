const express = require("express");
const os = require("os");
const path = require("path");
const client = require("prom-client");

const app = express();
const PORT = process.env.PORT || 3000;

// ---- View Engine ----
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// ---- Prometheus Metrics ----
client.collectDefaultMetrics({ prefix: "node_app_" });

const httpRequestsTotal = new client.Counter({
  name: "node_app_http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status"],
});

app.use((req, res, next) => {
  res.on("finish", () => {
    httpRequestsTotal.inc({
      method: req.method,
      route: req.path,
      status: String(res.statusCode),
    });
  });
  next();
});

// ---- Routes ----
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/dashboard", (req, res) => {
  res.render("dashboard", {
    hostname: os.hostname(),
    uptime: process.uptime().toFixed(2),
    memory: (process.memoryUsage().rss / 1024 / 1024).toFixed(2)
  });
});

// Prometheus metrics
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

// ---- Start ----
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});