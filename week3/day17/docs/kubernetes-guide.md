# Kubernetes Guide

---

## Purpose

This document explains the Kubernetes resources used in the Day 17 project and how they work together to deploy, manage, and monitor applications.

---

# What is Kubernetes?

Kubernetes (K8s) is an open-source container orchestration platform used to deploy, manage, scale, and monitor containerized applications.

---

# Kubernetes Architecture

A Kubernetes Cluster consists of:

- Control Plane
- Worker Nodes

Each Worker Node runs one or more Pods that host application containers.

---

# Kubernetes Resources Used

## 1. Namespace

Purpose:
- Provides logical isolation of Kubernetes resources.
- Keeps the project resources organized.

File:
```

k8s/namespace.yaml

```

---

## 2. ConfigMap

Purpose:
- Stores application configuration.
- Keeps configuration separate from application code.

Examples:

- NODE_ENV
- PORT
- API_BASE_URL
- LOG_LEVEL

File:

```

k8s/configmap.yaml

```

---

## 3. Secret

Purpose:
- Stores sensitive information securely.

Examples:

- JWT Secret
- MongoDB URI
- PostgreSQL Password
- Redis URL

File:

```

k8s/secret.yaml

```

---

## 4. Deployment

Purpose:

- Deploys application Pods.
- Maintains desired number of replicas.
- Automatically recreates failed Pods.
- Supports rolling updates.

File:

```

k8s/deployment.yaml

```

---

## 5. Service

Purpose:

- Exposes Pods inside the cluster.
- Provides stable networking.
- Performs internal load balancing.

File:

```

k8s/service.yaml

```

---

## 6. Ingress

Purpose:

- Provides external access.
- Routes HTTP/HTTPS traffic.
- Supports TLS termination.

File:

```

k8s/ingress.yaml

```

---

## 7. Persistent Volume (PV)

Purpose:

- Provides persistent storage.
- Data remains available even after Pod restart.

Files:

```

k8s/persistent-volume.yaml
mongodb-storage.yaml
postgresql-storage.yaml
prometheus-storage.yaml

```

---

## 8. Persistent Volume Claim (PVC)

Purpose:

- Requests storage from Persistent Volumes.
- Used by Deployments.

---

## 9. MongoDB Deployment

Purpose:

- Deploys MongoDB database.
- Exposes it through a ClusterIP Service.

File:

```

k8s/mongodb-deployment.yaml

```

---

## 10. PostgreSQL Deployment

Purpose:

- Deploys PostgreSQL database.
- Uses persistent storage.
- Exposes database internally.

File:

```

k8s/postgresql-deployment.yaml

```

---

## 11. Prometheus Monitoring

Purpose:

- Collects metrics.
- Monitors applications.
- Supports performance monitoring.

Files:

```

k8s/monitoring.yaml
prometheus-storage.yaml

```

---

# Best Practices

- Use Namespaces for isolation.
- Store secrets in Secret resources.
- Store configuration in ConfigMaps.
- Use Persistent Volumes for databases.
- Configure resource requests and limits.
- Enable readiness and liveness probes.
- Monitor applications using Prometheus.

---

# Conclusion

This project demonstrates a production-style Kubernetes deployment consisting of:

- Namespace
- ConfigMap
- Secret
- Deployment
- Service
- Ingress
- Persistent Storage
- MongoDB
- PostgreSQL
- Prometheus Monitoring

These resources together provide a scalable, secure, and maintainable Kubernetes application.
