# Week 2 - Day 8 Notes
## Advanced Node.js Backend Development

**Date:** 16 July 2026

---

# Objective

The objective of today's task was to build a production-style Node.js backend by implementing a modular service architecture, secure Express server configuration, REST APIs, real-time communication using Socket.IO, performance monitoring, and Node.js clustering.

---

# Technologies Used

- Node.js
- Express.js
- Socket.IO
- JWT Authentication
- bcryptjs
- UUID
- Helmet
- CORS
- Compression
- Express Rate Limit
- Winston Logger
- dotenv
- Node.js Cluster Module

---

# Project Structure

```
week2/day8
│
├── client/
│   └── index.html
│
├── server/
│   ├── config/
│   ├── middleware/
│   ├── routes/
│   ├── services/
│   ├── socket/
│   ├── utils/
│   └── index.js
│
├── cluster.js
├── package.json
├── package-lock.json
└── notes.md
```

---

# Features Implemented

## 1. Express Server Setup

- Configured Express server
- Created HTTP server
- Configured environment variables
- Added middleware support

---

## 2. Security Middleware

Implemented:

- Helmet
- CORS
- Compression
- Express Rate Limiter

Purpose:

- Secure HTTP headers
- Prevent abuse
- Compress API responses
- Enable secure cross-origin communication

---

## 3. User Module

Implemented complete User CRUD.

Features:

- Create User
- Login User
- Get User
- Update User
- Delete User

Authentication:

- JWT Token
- Password hashing using bcrypt

---

## 4. Product Module

Implemented Product CRUD APIs.

Features:

- Create Product
- Get Products
- Update Product
- Delete Product

---

## 5. Order Module

Implemented Order Management.

Features:

- Create Order
- Get Orders
- Update Order Status
- Delete Order

---

## 6. Global Error Handling

Created centralized error handler.

Benefits:

- Consistent API responses
- Easier debugging
- Better maintainability

---

## 7. Notification Service

Implemented EventEmitter-based notification service.

Events:

- user.created
- order.created
- product.updated

Purpose:

- Demonstrate event-driven architecture
- Keep business logic loosely coupled

---

## 8. Performance Monitoring

Created middleware to monitor request execution time.

Captured:

- HTTP Method
- Endpoint
- Status Code
- Response Time

Benefits:

- Detect slow APIs
- Performance analysis
- Better debugging

---

## 9. Socket.IO

Implemented real-time communication.

Features:

- Client connection
- Room joining
- User update events
- Order events

Purpose:

- Demonstrate bidirectional communication
- Enable real-time updates

---

## 10. Node.js Clustering

Implemented cluster module.

Features:

- Master Process
- Multiple Worker Processes
- Automatic Worker Restart

Benefits:

- Better CPU utilization
- Improved scalability
- Higher availability

---

# Challenges Faced

## Issue 1

Compression package not found.

Solution:

Installed missing dependency using npm.

---

## Issue 2

User data disappeared after restarting the server.

Reason:

Data was stored in memory using Map().

Solution:

Understood that persistence will be implemented later using MongoDB/PostgreSQL.

---

## Issue 3

Socket.IO CORS Error.

Reason:

Frontend and backend were running on different origins.

Solution:

Updated CORS configuration to allow both development origins.

---

## Issue 4

Cluster created multiple initialization logs.

Reason:

Each worker process loads the complete application independently.

Solution:

Verified that this is expected behavior in a clustered Node.js application.

---

# Key Learnings

- Service Layer Architecture
- Separation of Concerns
- Express Middleware
- JWT Authentication
- Password Hashing
- Event-Driven Architecture
- Socket.IO
- Performance Monitoring
- Node.js Clustering
- Production Folder Structure

---

# Best Practices Followed

- Modular Architecture
- Reusable Services
- Centralized Error Handling
- Environment Variables
- Clean Folder Structure
- Middleware-Based Design
- RESTful API Design
- Event-Driven Communication

---

# Future Improvements

- MongoDB Integration
- PostgreSQL Integration
- Redis Caching
- Docker Support
- Kubernetes Deployment
- Unit Testing
- Swagger API Documentation
- CI/CD Pipeline

---

# Manager Discussion Points

I can confidently explain:

- Why Service Layer is used.
- Difference between Routes and Services.
- Purpose of Middleware.
- Why EventEmitter is useful.
- Why Socket.IO instead of polling.
- Why Node.js Clustering improves performance.
- Why environment variables are important.
- Why in-memory storage will be replaced by a database.

---

# Conclusion

Successfully developed a modular and scalable Node.js backend application following production-oriented practices. The project demonstrates REST API development, middleware architecture, event-driven communication, real-time features using Socket.IO, and multi-core processing using Node.js Cluster.