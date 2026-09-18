# Deployment Guide

## 1. Prerequisites

Before deploying the application, make sure the following are installed and configured:

- Node.js 18+
- MongoDB
- PostgreSQL
- Redis
- Git
- Docker
- Docker Compose
- Nginx
- PM2

## 2. Environment Configuration

Create a `.env` file for the application.

```env
NODE_ENV=production
PORT=3000

MONGODB_URI=mongodb://localhost:27017/sda-training

POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=sda_training
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password

REDIS_URL=redis://localhost:6379

JWT_SECRET=your_secure_jwt_secret
SESSION_SECRET=your_secure_session_secret

FRONTEND_URL=http://localhost:3000
```

Never commit `.env` files or production secrets to Git.

## 3. Install Dependencies

Install backend dependencies:

```bash
npm install
```

Install frontend dependencies:

```bash
cd frontend
npm install
```

## 4. Database Setup

### MongoDB

Make sure MongoDB is running.

Configure the MongoDB connection:

```env
MONGODB_URI=mongodb://localhost:27017/sda-training
```

### PostgreSQL

Create the application database:

```sql
CREATE DATABASE sda_training;
```

Configure the PostgreSQL connection using the environment variables.

### Redis

Make sure Redis is running:

```text
redis://localhost:6379
```

Redis can be used for caching and session-related operations.

## 5. Run the Application

Start the backend application:

```bash
node server.js
```

The API should be available at:

```text
http://localhost:3000
```

Health check:

```text
http://localhost:3000/health
```

Metrics:

```text
http://localhost:3000/metrics
```

## 6. Docker Deployment

Build the Docker image:

```bash
docker build -t sda-training-api .
```

Run the Docker container:

```bash
docker run -p 3000:3000 --env-file .env sda-training-api
```

## 7. Docker Compose

Docker Compose can be used to run the application together with MongoDB, PostgreSQL, and Redis.

Example:

```yaml
services:
  api:
    build: .
    ports:
      - "3000:3000"
    env_file:
      - .env
    depends_on:
      - mongodb
      - postgres
      - redis

  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"

  postgres:
    image: postgres:latest
    environment:
      POSTGRES_DB: sda_training
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"

  redis:
    image: redis:latest
    ports:
      - "6379:6379"
```

Start all services:

```bash
docker compose up -d
```

Check running containers:

```bash
docker compose ps
```

## 8. Nginx Configuration

Nginx can be used as a reverse proxy in front of the Node.js API.

Example configuration:

```nginx
server {
    listen 80;

    server_name example.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Nginx forwards incoming requests to the Node.js application running on port 3000.

## 9. SSL Configuration

HTTPS should be enabled for production deployments.

SSL certificates can be configured with Nginx using a trusted certificate provider.

Production traffic should be redirected from HTTP to HTTPS.

## 10. PM2 Process Management

Install PM2 globally:

```bash
npm install -g pm2
```

Start the application:

```bash
pm2 start server.js --name sda-training-api
```

Check application status:

```bash
pm2 status
```

View application logs:

```bash
pm2 logs sda-training-api
```

Restart the application:

```bash
pm2 restart sda-training-api
```

Save the PM2 process configuration:

```bash
pm2 save
```

## 11. Database Backups

Regular database backups should be configured for production.

### MongoDB Backup

```bash
mongodump --db sda-training --out ./backup
```

### PostgreSQL Backup

```bash
pg_dump sda_training > backup.sql
```

Backups should be stored securely and tested regularly to ensure they can be restored.

## 12. Security Checklist

Before production deployment:

- [ ] Use strong JWT secrets
- [ ] Use strong database passwords
- [ ] Keep `.env` out of Git
- [ ] Enable HTTPS
- [ ] Configure CORS correctly
- [ ] Enable rate limiting
- [ ] Validate user input
- [ ] Use secure authentication
- [ ] Keep dependencies updated
- [ ] Secure database access
- [ ] Enable application logging
- [ ] Configure regular database backups
- [ ] Monitor application health
- [ ] Monitor application performance

## 13. Production Monitoring

The application provides monitoring endpoints:

```text
GET /health
GET /metrics
```

Winston log files are stored in:

```text
logs/combined.log
logs/error.log
```

These logs provide information about application requests, errors, response times, and application activity.

The `/health` endpoint provides application health information.

The `/metrics` endpoint provides:

- Application uptime
- Memory usage
- Request metrics
- Error information
- Process information

## 14. Deployment Verification

After deployment, verify the following:

1. The application starts successfully.
2. MongoDB connection works.
3. PostgreSQL connection works.
4. Redis connection works.
5. `/health` returns a healthy status.
6. `/metrics` returns monitoring information.
7. Authentication endpoints work.
8. API requests return expected responses.
9. Winston logs are generated.
10. Database backups are working.
11. HTTPS is configured correctly.
12. PM2 is running the application successfully.

## 15. Deployment Workflow

The recommended deployment flow is:

```text
Developer
   ↓
Git Repository
   ↓
Install Dependencies
   ↓
Configure Environment
   ↓
Database Setup
   ↓
Build Application
   ↓
Docker / PM2
   ↓
Nginx Reverse Proxy
   ↓
HTTPS
   ↓
Production Application
   ↓
Monitoring & Logging
   ↓
Backups
```

## 16. Production Readiness

Before moving the application to production, confirm that:

- Environment variables are configured.
- Database connections are working.
- Redis is available.
- Authentication is enabled.
- API security controls are configured.
- Monitoring is enabled.
- Logs are being generated.
- Backups are configured.
- HTTPS is enabled.
- Application health can be checked.
- Deployment processes have been tested.