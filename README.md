🚀 DevOps Capstone Project
End-to-End CI/CD Pipeline for Node.js Web Application

📌 Project Overview
This project demonstrates a complete DevOps implementation of a Node.js web application using modern DevOps practices.

The project integrates:
- GitHub for source control
- Jenkins for automated CI/CD pipeline
- Docker for containerization
- Docker Hub for image registry
- AWS EC2 for cloud deployment
- Prometheus & Grafana for monitoring
- Bash & Cron for automation

The goal of this project is to automate build, deployment, monitoring, and maintenance processes in a production-like cloud environment.

⚠️ Note on Current Deployment Status
All 3 AWS EC2 instances used in this project (`jenkins-ec2`, `app-ec2`, `monitor-ec2`) have since been terminated to avoid ongoing cloud costs, as this is a personal portfolio project rather than a production service. The pipeline, configuration, and monitoring setup described below reflect the fully working deployment as it existed, and the entire stack (Jenkins, Docker, Prometheus, Grafana) can be redeployed on new EC2 instances by following the steps in this README.

🏗 Architecture Overview
Developer → GitHub → Jenkins → Docker Hub → App EC2 → Prometheus → Grafana

Flow Explanation:
1. Developer pushes code to GitHub (main branch).
2. Jenkins (running on EC2) is triggered automatically via GitHub webhook.
3. Jenkins builds and tags the Docker image.
4. The image is pushed to Docker Hub.
5. Jenkins SSHs into App EC2 and deploys the updated container.
6. Prometheus scrapes infrastructure and application metrics.
7. Grafana visualizes system and application metrics.
8. Cron jobs handle automated backups and cleanup tasks.

🛠 Tech Stack
| Layer | Technology |
|---|---|
| Source Control | Git + GitHub |
| CI/CD | Jenkins (EC2) |
| Application | Node.js + Express |
| Containerization | Docker |
| Registry | Docker Hub |
| Infrastructure | AWS EC2 (Ubuntu 22.04, ap-south-1) |
| Instance Type | t3.micro |
| Monitoring | Prometheus + Grafana |
| Metrics Exporter | Node Exporter |
| Automation | Bash Scripts + Cron |

📂 Project Structure
```
devops-node-capstone/
├── app/
│   ├── server.js
│   ├── package.json
├── Dockerfile
├── Jenkinsfile
├── docker-compose.monitoring.yml
├── prometheus/
│   └── prometheus.yml
├── scripts/
│   ├── backup_logs.sh
│   └── cleanup_logs.sh
└── README.md
```

▶️ Run Application Locally
Clone repository:
```bash
git clone https://github.com/prapanjanprabhu/devops-node-capstone.git
cd devops-node-capstone/app
```

Install dependencies:
```bash
npm install
```

Start application:
```bash
npm start
```

Open in browser: `http://localhost:3000`

Available endpoints:
- `/`
- `/about`
- `/metrics`

The `/metrics` endpoint exposes Prometheus metrics using the prom-client library.

🐳 Docker Build & Run
Build image:
```bash
docker build -t prapanjanprabhu/devops-node-capstone .
```

Run container:
```bash
docker run -d -p 3000:3000 prapanjanprabhu/devops-node-capstone
```

Access application: `http://localhost:3000`

🔁 CI/CD Pipeline Flow (Jenkins)
Branch: `main`

Pipeline stages:
1. Checkout source code
2. Install dependencies
3. Build Docker image
4. Tag image as:
   - `latest`
   - `1`, `2`, `3` (Jenkins build numbers)
5. Push image to Docker Hub
6. SSH into App EC2
7. Pull latest image
8. Stop old container
9. Run updated container

Docker Tags Used:
```
prapanjanprabhu/devops-node-capstone:latest
prapanjanprabhu/devops-node-capstone:1
prapanjanprabhu/devops-node-capstone:2
prapanjanprabhu/devops-node-capstone:3
```

This tagging strategy enables version tracking and rollback support.

☁ AWS Deployment (Reference — instances now terminated)
Region: `ap-south-1`
Instance Type: `t3.micro`

EC2 Instances used (no longer running):
- `jenkins-ec2`
- `app-ec2` (previously public IP: `35.154.72.81`)
- `monitor-ec2` (previously public IP: `43.205.120.225`)

Deployment Command Used:
```bash
docker pull prapanjanprabhu/devops-node-capstone:latest
docker stop capstone-app
docker rm capstone-app
docker run -d --restart unless-stopped -p 80:3000 prapanjanprabhu/devops-node-capstone:latest
```

📊 Monitoring Setup
Node Exporter (App EC2):
```bash
docker run -d --name node-exporter -p 9100:9100 prom/node-exporter
```

Prometheus Targets (All UP when live):
- prometheus
- node_exporter_app
- capstone_app

Dashboards Created:
- CPU Usage
- Memory Usage
- Disk Usage
- HTTP Request Counter (`node_app_http_requests_total`)

🛠 Automation (Backup & Cleanup)
Backup Script: `scripts/backup_logs.sh`
Cleanup Script: `scripts/cleanup_logs.sh`

Cron Schedule:
```
0 1 * * *   Backup at 1:00 AM
30 1 * * *  Cleanup at 1:30 AM
```

🧪 Results
- Fully automated CI/CD pipeline
- Average deployment time under 2 minutes
- Real-time infrastructure monitoring
- Application-level HTTP request tracking
- Automated nightly log backup
- Docker image rollback capability

🚧 Challenges Faced
- Docker networking configuration issues
- Prometheus YAML parsing errors
- AWS security group configuration
- Dependency vulnerability fixes

All issues were resolved through debugging and configuration improvements.

🔮 Future Enhancements
- Integrate Trivy for container security scanning
- Implement Blue-Green deployment strategy
- Add Prometheus Alertmanager
- Use AWS S3 for remote backups
- Implement GitHub Actions as alternative CI/CD

📜 License
This project was developed for academic DevOps Capstone submission.
