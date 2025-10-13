# Deployment Guide

## Overview

This guide covers deployment strategies for the SDA Training Program applications across different environments.

## Prerequisites

### Required Tools
- Docker and Docker Compose
- Kubernetes cluster (Minikube, GKE, EKS, AKS)
- kubectl configured
- Git
- Node.js 18+
- Python 3.8+

### Required Accounts
- GitHub account
- Cloud provider account (AWS, GCP, Azure)
- Docker Hub or container registry
- Domain name (for production)

## Environment Setup

### Development Environment

1. **Clone Repository**
   ```bash
   git clone https://github.com/mechlin-tech/sda-training.git
   cd sda-training
   ```

2. **Install Dependencies**
   ```bash
   npm install
   cd ai && pip install -r requirements.txt
   ```

3. **Environment Variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start Services**
   ```bash
   docker-compose up -d
   ```

### Staging Environment

1. **Deploy to Staging**
   ```bash
   kubectl apply -f k8s/staging/
   ```

2. **Verify Deployment**
   ```bash
   kubectl get pods -n sda-training-staging
   kubectl get services -n sda-training-staging
   ```

### Production Environment

1. **Deploy to Production**
   ```bash
   kubectl apply -f k8s/production/
   ```

2. **SSL Certificate Setup**
   ```bash
   kubectl apply -f k8s/ssl/
   ```

3. **Monitoring Setup**
   ```bash
   kubectl apply -f k8s/monitoring/
   ```

## Docker Deployment

### Build Images

```bash
# Build all images
docker-compose build

# Build specific service
docker-compose build frontend
docker-compose build backend
docker-compose build ai-service
```

### Run Services

```bash
# Start all services
docker-compose up -d

# Start specific service
docker-compose up -d frontend

# View logs
docker-compose logs -f backend
```

### Environment Configuration

```yaml
# docker-compose.override.yml
version: '3.8'

services:
  frontend:
    environment:
      - REACT_APP_API_URL=http://localhost:5000
      - REACT_APP_WS_URL=ws://localhost:5000
  
  backend:
    environment:
      - NODE_ENV=development
      - MONGODB_URI=mongodb://mongodb:27017/sda_training
      - POSTGRES_URL=postgresql://postgres:password@postgresql:5432/sda_training
      - REDIS_URL=redis://redis:6379
      - OPENAI_API_KEY=${OPENAI_API_KEY}
```

## Kubernetes Deployment

### Namespace Setup

```yaml
# k8s/namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: sda-training
  labels:
    app: sda-training
    environment: production
```

### ConfigMaps

```yaml
# k8s/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: sda-training-config
  namespace: sda-training
data:
  NODE_ENV: "production"
  PORT: "5000"
  API_BASE_URL: "https://api.sda-training.com"
  LOG_LEVEL: "info"
```

### Secrets

```yaml
# k8s/secrets.yaml
apiVersion: v1
kind: Secret
metadata:
  name: sda-training-secrets
  namespace: sda-training
type: Opaque
data:
  JWT_SECRET: <base64-encoded-secret>
  MONGODB_URI: <base64-encoded-mongodb-uri>
  POSTGRES_URL: <base64-encoded-postgres-url>
  REDIS_URL: <base64-encoded-redis-url>
  OPENAI_API_KEY: <base64-encoded-openai-key>
```

### Deployments

```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: sda-training-backend
  namespace: sda-training
spec:
  replicas: 3
  selector:
    matchLabels:
      app: sda-training
      component: backend
  template:
    metadata:
      labels:
        app: sda-training
        component: backend
    spec:
      containers:
      - name: backend
        image: sda-training-backend:latest
        ports:
        - containerPort: 5000
        env:
        - name: NODE_ENV
          valueFrom:
            configMapKeyRef:
              name: sda-training-config
              key: NODE_ENV
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: sda-training-secrets
              key: JWT_SECRET
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 5000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 5000
          initialDelaySeconds: 5
          periodSeconds: 5
```

### Services

```yaml
# k8s/service.yaml
apiVersion: v1
kind: Service
metadata:
  name: sda-training-backend-service
  namespace: sda-training
spec:
  type: ClusterIP
  ports:
  - port: 5000
    targetPort: 5000
    protocol: TCP
  selector:
    app: sda-training
    component: backend
```

### Ingress

```yaml
# k8s/ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: sda-training-ingress
  namespace: sda-training
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
spec:
  tls:
  - hosts:
    - api.sda-training.com
    secretName: sda-training-tls
  rules:
  - host: api.sda-training.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: sda-training-backend-service
            port:
              number: 5000
```

## CI/CD Pipeline

### GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
    
    - name: Setup Docker Buildx
      uses: docker/setup-buildx-action@v3
    
    - name: Login to Docker Hub
      uses: docker/login-action@v3
      with:
        username: ${{ secrets.DOCKER_USERNAME }}
        password: ${{ secrets.DOCKER_PASSWORD }}
    
    - name: Build and push images
      uses: docker/build-push-action@v5
      with:
        context: .
        push: true
        tags: |
          sda-training-frontend:latest
          sda-training-backend:latest
          sda-training-ai:latest
    
    - name: Deploy to Kubernetes
      run: |
        kubectl apply -f k8s/
        kubectl rollout status deployment/sda-training-backend -n sda-training
```

### Deployment Scripts

```bash
#!/bin/bash
# scripts/deploy.sh

set -e

echo "🚀 Deploying SDA Training Application"

# Build images
echo "📦 Building Docker images..."
docker-compose build

# Push images
echo "📤 Pushing images to registry..."
docker-compose push

# Deploy to Kubernetes
echo "☸️ Deploying to Kubernetes..."
kubectl apply -f k8s/

# Wait for deployment
echo "⏳ Waiting for deployment..."
kubectl rollout status deployment/sda-training-backend -n sda-training

# Verify deployment
echo "✅ Verifying deployment..."
kubectl get pods -n sda-training
kubectl get services -n sda-training

echo "🎉 Deployment completed successfully!"
```

## Environment-Specific Configurations

### Development

```yaml
# k8s/development/values.yaml
replicas: 1
resources:
  requests:
    memory: "256Mi"
    cpu: "250m"
  limits:
    memory: "512Mi"
    cpu: "500m"
```

### Staging

```yaml
# k8s/staging/values.yaml
replicas: 2
resources:
  requests:
    memory: "512Mi"
    cpu: "250m"
  limits:
    memory: "1Gi"
    cpu: "500m"
```

### Production

```yaml
# k8s/production/values.yaml
replicas: 3
resources:
  requests:
    memory: "1Gi"
    cpu: "500m"
  limits:
    memory: "2Gi"
    cpu: "1000m"
```

## Monitoring and Logging

### Prometheus Configuration

```yaml
# k8s/monitoring/prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'sda-training'
    static_configs:
      - targets: ['sda-training-backend-service:5000']
    metrics_path: '/metrics'
    scrape_interval: 5s
```

### Grafana Dashboard

```json
{
  "dashboard": {
    "title": "SDA Training Metrics",
    "panels": [
      {
        "title": "Request Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_requests_total[5m])",
            "legendFormat": "{{method}} {{endpoint}}"
          }
        ]
      }
    ]
  }
}
```

### Log Aggregation

```yaml
# k8s/logging/fluentd.yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: fluentd
  namespace: kube-system
spec:
  template:
    spec:
      containers:
      - name: fluentd
        image: fluent/fluentd-kubernetes-daemonset:v1-debian-elasticsearch
        env:
        - name: FLUENT_ELASTICSEARCH_HOST
          value: "elasticsearch.logging.svc.cluster.local"
        - name: FLUENT_ELASTICSEARCH_PORT
          value: "9200"
```

## Security Considerations

### Network Policies

```yaml
# k8s/security/network-policy.yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: sda-training-network-policy
  namespace: sda-training
spec:
  podSelector:
    matchLabels:
      app: sda-training
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: ingress-nginx
    ports:
    - protocol: TCP
      port: 5000
  egress:
  - to:
    - namespaceSelector:
        matchLabels:
          name: sda-training
    ports:
    - protocol: TCP
      port: 5000
```

### Pod Security Policy

```yaml
# k8s/security/pod-security-policy.yaml
apiVersion: policy/v1beta1
kind: PodSecurityPolicy
metadata:
  name: sda-training-psp
spec:
  privileged: false
  allowPrivilegeEscalation: false
  requiredDropCapabilities:
    - ALL
  volumes:
    - 'configMap'
    - 'emptyDir'
    - 'projected'
    - 'secret'
    - 'downwardAPI'
    - 'persistentVolumeClaim'
```

## Backup and Recovery

### Database Backup

```bash
#!/bin/bash
# scripts/backup-db.sh

# MongoDB backup
mongodump --uri="$MONGODB_URI" --out=/backup/mongodb/$(date +%Y%m%d_%H%M%S)

# PostgreSQL backup
pg_dump "$POSTGRES_URL" > /backup/postgresql/$(date +%Y%m%d_%H%M%S).sql

# Upload to cloud storage
aws s3 cp /backup/ s3://sda-training-backups/ --recursive
```

### Application Backup

```bash
#!/bin/bash
# scripts/backup-app.sh

# Backup Kubernetes resources
kubectl get all -n sda-training -o yaml > /backup/k8s/$(date +%Y%m%d_%H%M%S).yaml

# Backup configuration
kubectl get configmaps,secrets -n sda-training -o yaml > /backup/config/$(date +%Y%m%d_%H%M%S).yaml
```

## Troubleshooting

### Common Issues

1. **Pod Not Starting**
   ```bash
   kubectl describe pod <pod-name> -n sda-training
   kubectl logs <pod-name> -n sda-training
   ```

2. **Service Not Accessible**
   ```bash
   kubectl get services -n sda-training
   kubectl get endpoints -n sda-training
   ```

3. **Ingress Issues**
   ```bash
   kubectl describe ingress sda-training-ingress -n sda-training
   kubectl get ingress -n sda-training
   ```

### Debug Commands

```bash
# Check cluster status
kubectl cluster-info

# Check node status
kubectl get nodes

# Check pod status
kubectl get pods -n sda-training

# Check service status
kubectl get services -n sda-training

# Check ingress status
kubectl get ingress -n sda-training

# View logs
kubectl logs -f deployment/sda-training-backend -n sda-training

# Execute commands in pod
kubectl exec -it <pod-name> -n sda-training -- /bin/bash
```

## Performance Optimization

### Resource Limits

```yaml
resources:
  requests:
    memory: "512Mi"
    cpu: "250m"
  limits:
    memory: "1Gi"
    cpu: "500m"
```

### Horizontal Pod Autoscaler

```yaml
# k8s/hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: sda-training-hpa
  namespace: sda-training
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: sda-training-backend
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

## Support

For deployment support:
- **Email**: deployment@mechlin.tech
- **Documentation**: https://docs.sda-training.com/deployment
- **GitHub Issues**: https://github.com/mechlin-tech/sda-training/issues
