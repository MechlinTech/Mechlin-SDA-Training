# DevOps & Environment Management Guide

---

# Overview

## Purpose

This document explains how the application manages different environments,
stores sensitive configuration securely, defines infrastructure using Docker
Compose, and monitors application health.

The objective is to provide a consistent development experience while making
deployment easier across Development, Staging, and Production environments.

---

# What is DevOps?

DevOps is a software development approach that combines Development (Dev)
and Operations (Ops) to improve collaboration, automation, software quality,
and deployment speed.

Its main goals are:

- Faster software delivery
- Reliable deployments
- Automated infrastructure
- Continuous monitoring
- Improved collaboration

---

# Environment Management

The project supports three different environments.

## 1. Development

Purpose:
- Local development
- Testing new features

Characteristics:
- Debug logging
- Local databases
- Faster development cycle
- Less strict security

Configuration File:
```
config/environments.js
```

---

## 2. Staging

Purpose:
- Test the application before production deployment.

Characteristics:

- Production-like environment
- SSL enabled
- Cloud databases
- Performance testing

---

## 3. Production

Purpose:

Live environment used by end users.

Characteristics:

- Maximum security
- Optimized performance
- Monitoring enabled
- Secure database connections
- Error logging

---

# Environment Variables

Sensitive information should never be hardcoded.

Instead, use environment variables.

Examples:

```
NODE_ENV=development
PORT=3000

JWT_SECRET=your-secret-key

MONGODB_URI=mongodb://localhost:27017/sda-training

POSTGRES_URL=postgres://user:password@localhost/database

REDIS_URL=redis://localhost:6379
```

Benefits:

- Improved security
- Easier deployment
- Different configuration per environment

---

# Secrets Management

The project uses:

```
config/secrets.js
```

Responsibilities:

- Read environment variables
- Validate required secrets
- Encrypt sensitive data
- Decrypt encrypted values
- Prevent missing configuration

Required Secrets:

- JWT_SECRET
- MONGODB_URI
- POSTGRES_PASSWORD
- REDIS_URL

---

# Infrastructure as Code

Infrastructure is defined using Docker Compose.

File:

```
infrastructure/docker-compose.yml
```

Services Included:

- Node.js Application
- MongoDB
- PostgreSQL
- Redis
- Nginx

Advantages:

- Easy setup
- Same environment for every developer
- Simple deployment
- Consistent infrastructure

Run the project using:

```bash
docker compose up -d
```

Stop the project:

```bash
docker compose down
```

---

# Monitoring & Health Checks

Monitoring is implemented in:

```
monitoring/health-check.js
```

Health checks include:

- MongoDB status
- PostgreSQL status
- Redis status
- CPU information
- Memory usage
- Node.js version
- Application uptime

Health Endpoint Example:

```json
{
  "status": "healthy",
  "timestamp": "...",
  "checks": {
    "database": {},
    "redis": {},
    "postgresql": {},
    "system": {}
  }
}
```

---

# Project Structure

```
week3/
└── day15/
    ├── config/
    │   ├── environments.js
    │   └── secrets.js
    │
    ├── infrastructure/
    │   └── docker-compose.yml
    │
    ├── monitoring/
    │   └── health-check.js
    │
    └── docs/
        └── devops-guide.md
```

---

# Best Practices

## Configuration

- Never hardcode secrets
- Keep configuration environment-specific
- Validate required variables

## Security

- Store secrets in environment variables
- Use HTTPS in production
- Rotate credentials regularly

## Docker

- Use named volumes
- Keep containers isolated
- Restart failed containers automatically

## Monitoring

- Monitor databases
- Monitor memory usage
- Monitor CPU usage
- Monitor application uptime

---

# Key Learnings

During Day 15, the following concepts were implemented:

- Multi-environment configuration
- Environment variables
- Secrets management
- Docker Compose infrastructure
- Health monitoring
- DevOps documentation

---

# Conclusion

A well-designed DevOps workflow improves software quality, deployment speed,
security, and maintainability.

Using environment-specific configuration, secure secrets management,
containerized infrastructure, and continuous monitoring ensures that the
application is reliable and ready for deployment in real-world environments.