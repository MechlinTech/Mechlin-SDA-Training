# 🚀 Deployment Guide

## Overview

This document explains how to set up, configure, run, test, and deploy the Week 2 Day 14 Integration Review project.

The application consists of:

- React Frontend
- Express.js Backend
- MongoDB Database
- Socket.IO
- JWT Authentication

---

# System Requirements

Before running the application, ensure the following software is installed.

| Software | Version |
|-----------|---------|
| Node.js | 18+ |
| npm | 9+ |
| MongoDB | 6+ |
| Git | Latest |

---

# Project Structure

```
week2/day8/
├── client/
├── server/
├── tests/
├── package.json
└── .env
```

---

# Clone the Repository

```bash
git clone <repository-url>
cd Mechlin-SDA-Training
```

---

# Install Dependencies

Navigate to the backend project.

```bash
cd week2/day8
```

Install all required packages.

```bash
npm install
```

---

# Environment Configuration

Create a `.env` file if it does not already exist.

Example:

```env
NODE_ENV=development

PORT=3000

JWT_SECRET=your-secret-key

JWT_EXPIRE=1d

MONGODB_URI=mongodb://localhost:27017/sda-training
```

---

# Database Configuration

Ensure MongoDB is running.

The application connects using:

```text
mongodb://localhost:27017/sda-training
```

If the database does not exist, MongoDB creates it automatically after the first write operation.

---

# Running the Backend

Start the backend server.

```bash
npm start
```

Expected output:

```text
MongoDB Connected

Server running on port 3000
```

---

# Running the Frontend

Navigate to the frontend directory.

```bash
cd frontend
```

Install dependencies.

```bash
npm install
```

Run the development server.

```bash
npm run dev
```

Default frontend URL:

```
http://localhost:5173
```

---

# API Configuration

Update the frontend API base URL.

Example:

```javascript
http://localhost:3000/api
```

Ensure the frontend communicates with the backend through the configured API endpoint.

---

# Authentication

The application uses JWT authentication.

Login Flow:

1. Register user
2. Login
3. Receive JWT Access Token
4. Store token
5. Send token using:

```
Authorization: Bearer <access_token>
```

---

# Running Tests

Execute all integration tests.

```bash
npm test
```

Expected Result:

```
PASS

9 Tests Passed
```

---

# Monitoring

The application includes:

- Winston Logger
- Performance Middleware
- Request Logging
- Error Logging
- Response Time Tracking

These components help monitor application performance during development.

---

# Production Considerations

Before deploying to production:

- Use strong JWT secrets.
- Enable HTTPS.
- Configure secure CORS policies.
- Use environment variables for secrets.
- Enable log rotation.
- Regularly back up the MongoDB database.
- Monitor application performance and errors.

---

# Troubleshooting

## MongoDB Connection Failed

Verify:

- MongoDB is installed.
- MongoDB service is running.
- `MONGODB_URI` is correct.

---

## Port Already in Use

Terminate the existing process or update the application port in the `.env` file.

---

## JWT Authentication Failed

Verify:

- JWT token is included in the `Authorization` header.
- Token has not expired.
- JWT secret matches the backend configuration.

---

## Frontend Cannot Connect

Verify:

- Backend server is running.
- API URL is correct.
- CORS configuration allows frontend requests.

---

# Deployment Checklist

Before deployment, confirm:

- [ ] Dependencies installed
- [ ] Environment variables configured
- [ ] MongoDB running
- [ ] Backend starts successfully
- [ ] Frontend starts successfully
- [ ] API communication verified
- [ ] Authentication working
- [ ] Integration tests passing
- [ ] Logging enabled

---

# Conclusion

The application is deployment-ready for development and testing environments.

Following this guide ensures consistent setup, successful frontend-backend communication, secure authentication, database connectivity, and reliable execution of the complete application.