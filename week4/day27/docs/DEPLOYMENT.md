# AI Productivity Capstone - Deployment Guide

## 1. Overview

This document explains the deployment process for the AI Productivity Capstone.

The application consists of:

- React Frontend
- Express Backend
- MongoDB Atlas
- Google Gemini AI
- Docker Configuration
- Kubernetes Configuration
- GitHub Actions CI/CD

---

# 2. Deployment Architecture

                Internet
                    │
                    ▼
          React Frontend (Vite)
                    │
                    ▼
            Express Backend API
                    │
        ┌───────────┴────────────┐
        ▼                        ▼
 MongoDB Atlas             Google Gemini

---

# 3. Local Deployment

## Backend

Navigate to backend folder.

```bash
cd backend
```

Install dependencies.

```bash
npm install
```

Run server.

```bash
npm run dev
```

Server URL

```
http://localhost:5000
```

---

## Frontend

Navigate to frontend.

```bash
cd frontend
```

Install dependencies.

```bash
npm install
```

Run application.

```bash
npm run dev
```

Frontend URL

```
http://localhost:5173
```

---

# 4. Environment Variables

Backend requires:

```env
PORT=5000

MONGODB_URI=<your_mongodb_connection_string>

JWT_SECRET=<your_secret_key>

GEMINI_API_KEY=<your_api_key>
```

Never commit the `.env` file to version control.

---

# 5. Docker Deployment

Navigate to:

```bash
week4/day27/devops/docker
```

Build containers.

```bash
docker compose build
```

Start containers.

```bash
docker compose up
```

Run in detached mode.

```bash
docker compose up -d
```

Stop containers.

```bash
docker compose down
```

---

# 6. Docker Components

Docker configuration includes:

- Backend Container
- Frontend Container
- MongoDB Container

Docker Compose manages communication between these services.

---

# 7. Kubernetes Deployment

Navigate to:

```bash
week4/day27/devops/kubernetes
```

Apply all manifests.

```bash
kubectl apply -f .
```

Check deployments.

```bash
kubectl get deployments
```

Check services.

```bash
kubectl get services
```

Check pods.

```bash
kubectl get pods
```

Delete deployment.

```bash
kubectl delete -f .
```

---

# 8. Kubernetes Resources

The project includes:

- Backend Deployment
- Backend Service
- Frontend Deployment
- Frontend Service
- MongoDB Deployment
- MongoDB Service
- ConfigMap
- Secret
- Ingress

---

# 9. GitHub Actions

CI workflow automatically executes on:

- Push
- Pull Request

Workflow performs:

- Checkout Repository
- Install Dependencies
- Build Frontend
- Backend Dependency Installation
- Test Execution (if available)

---

# 10. Deployment Checklist

Before deployment verify:

- MongoDB Atlas is accessible
- Gemini API Key is valid
- Environment variables are configured
- Backend starts successfully
- Frontend connects to backend
- Authentication works
- AI Assistant responds correctly

---

# 11. Common Deployment Issues

### MongoDB Connection Failed

Check:

- Connection string
- Network access
- Database credentials

---

### JWT Authentication Error

Check:

- JWT_SECRET
- Authorization header

---

### Gemini API Error

Verify:

- GEMINI_API_KEY
- API quota
- Internet connectivity

---

### Docker Build Failure

Check:

- Docker installation
- Dockerfile
- docker-compose.yml

---

### Kubernetes Pod Crash

Check pod logs.

```bash
kubectl logs <pod-name>
```

Describe pod.

```bash
kubectl describe pod <pod-name>
```

---

# 12. Future Improvements

Future deployment enhancements:

- Nginx Reverse Proxy
- HTTPS using TLS
- Automatic Scaling
- Redis Cache
- Monitoring with Prometheus
- Grafana Dashboard
- Cloud Deployment (AWS / Azure / GCP)

---

# 13. Conclusion

The AI Productivity Capstone can be deployed locally using Node.js, containerized using Docker, orchestrated with Kubernetes, and integrated with GitHub Actions for continuous integration.