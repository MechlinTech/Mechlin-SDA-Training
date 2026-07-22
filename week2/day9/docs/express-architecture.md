# Express Middleware Architecture

## 📖 Overview

This project implements a production-ready Express.js backend using a layered middleware architecture. The application focuses on security, scalability, request validation, authentication, authorization, centralized error handling, and performance monitoring.

The architecture follows Express middleware chaining, where every incoming request passes through a series of middleware before reaching the route controller.

---

# Project Structure

```
week2/day8/
│
├── cluster.js
│
├── server/
│   ├── app.js
│   ├── index.js
│   │
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── validation.js
│   │   ├── errorHandler.js
│   │   ├── logger.js
│   │   └── performance.js
│   │
│   ├── routes/
│   │   ├── userRoutes.js
│   │   ├── productRoutes.js
│   │   ├── orderRoutes.js
│   │   └── healthRoutes.js
│   │
│   ├── services/
│   └── socket/
│
└── docs/
```

---

# Request Lifecycle

Every HTTP request follows the same processing flow.

```
Client
   │
   ▼
Express Server
   │
   ▼
Security Middleware
(Helmet, CORS, Compression)
   │
   ▼
Rate Limiter
   │
   ▼
Performance Logger
   │
   ▼
Authentication
(JWT)
   │
   ▼
Authorization
(Role Based)
   │
   ▼
Validation
(express-validator)
   │
   ▼
Route Controller
   │
   ▼
Service Layer
   │
   ▼
Response
```

---

# Middleware Execution Order

Middleware executes from left to right.

Example:

```javascript
router.put(
    "/:id",
    authenticate,
    validateId,
    validateUser,
    updateUser
);
```

Execution Order:

1. Authenticate user.
2. Validate route parameter.
3. Validate request body.
4. Execute controller.
5. Send response.

---

# Authentication

Authentication verifies the identity of the client using JWT (JSON Web Token).

Process:

1. User logs in.
2. Server verifies credentials.
3. JWT token is generated.
4. Client stores the token.
5. Client sends the token in every protected request.
6. Server validates the token before allowing access.

Header Example:

```
Authorization: Bearer <JWT_TOKEN>
```

---

# Authorization

Authorization controls which authenticated users can access specific resources.

Roles implemented:

- Admin
- User

Example:

```javascript
authenticate,
authorize("admin")
```

Only users with the **Admin** role can perform administrative operations such as deleting users or managing products.

---

# Validation

Request validation is implemented using **express-validator**.

Reusable validators:

- validateUser
- validateLogin
- validateProduct
- validateOrder
- validateId
- validatePagination

Benefits:

- Prevents invalid input.
- Improves API reliability.
- Reduces unnecessary controller logic.
- Provides meaningful error messages.

---

# Error Handling

A centralized error handling middleware is used to handle application errors consistently.

Responsibilities:

- Handle validation errors.
- Handle authentication errors.
- Handle authorization errors.
- Handle unexpected server errors.
- Return standardized JSON responses.

Example:

```json
{
    "success": false,
    "message": "Validation failed"
}
```

---

# Security Middleware

The application uses multiple middleware to improve security.

### Helmet

Adds secure HTTP headers.

Purpose:

- Prevent clickjacking.
- Prevent MIME sniffing.
- Improve browser security.

---

### CORS

Allows secure communication between frontend and backend applications.

---

### Compression

Compresses HTTP responses to reduce response size and improve performance.

---

### Rate Limiting

Protects APIs against excessive requests and brute-force attacks.

Example:

```
100 requests / 15 minutes
```

---

# Performance Monitoring

Performance middleware records request execution time.

Benefits:

- Detect slow endpoints.
- Improve debugging.
- Monitor API performance.

Example:

```
GET /users
Response Time: 18 ms
```

---

# Route Organization

The application follows RESTful routing.

### User Routes

```
POST   /users
POST   /users/login
GET    /users
GET    /users/:id
PUT    /users/:id
DELETE /users/:id
```

### Product Routes

```
POST   /products
GET    /products
GET    /products/:id
PUT    /products/:id
DELETE /products/:id
```

### Order Routes

```
POST   /orders
GET    /orders
GET    /orders/:id
PUT    /orders/:id
DELETE /orders/:id
```

---

# Clustering

Node.js Cluster module is used to improve application performance.

Features:

- One worker process per CPU core (or a reduced number in development).
- Automatic worker restart on crash.
- Better CPU utilization.
- Improved scalability.

Architecture:

```
Master Process
      │
 ┌────┼────┐
 │    │    │
 ▼    ▼    ▼
Worker Worker Worker
```

---

# Best Practices Implemented

- Modular folder structure.
- Middleware separation.
- Reusable validation logic.
- JWT authentication.
- Role-based authorization.
- Centralized error handling.
- RESTful API design.
- Production-ready security middleware.
- Performance monitoring.
- Cluster-based scalability.

---

# Conclusion

The Day 9 implementation demonstrates a scalable and maintainable Express.js backend architecture. By combining middleware-based request processing, JWT authentication, validation, centralized error handling, security enhancements, and clustering, the application follows industry-standard backend development practices suitable for modern Node.js applications.