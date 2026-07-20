# API Design Documentation

## Overview

This project implements a RESTful API using Express.js following modern backend development practices.

---

## API Versioning

Base URL

```
/api/v1
```

---

## Modules

- Users
- Products
- Orders
- Health

---

## Authentication

JWT Bearer Authentication

```
Authorization: Bearer <token>
```

---

## Authorization

Role Based Access Control

Roles

- Admin
- User

---

## Validation

Request validation is implemented using middleware before controller execution.

---

## Middleware

- Helmet
- CORS
- Compression
- Authentication
- Authorization
- Validation
- Performance Monitoring
- Error Handling
- Rate Limiting
- API Versioning

---

## Caching

Redis caching has been integrated.

Currently Redis initialization is disabled during local development because a Redis server is not installed.

Cached APIs

- GET /products
- GET /products/:id

Cache is automatically invalidated after:

- Create Product
- Update Product
- Delete Product

---

## Rate Limiting

The application includes multiple rate limiters.

- General Limiter
- Login Limiter
- Strict Limiter
- Analytics Limiter

---

## Error Handling

Centralized Error Handler

Consistent JSON Error Responses

Logging using Winston

---

## API Documentation

Swagger UI

```
/api-docs
```

---

## Security

- JWT Authentication
- Role Based Authorization
- Helmet
- CORS
- Input Validation

---

## Performance

- Compression
- Redis Cache
- Performance Middleware

---

## Future Improvements

- Enable Redis Server
- Docker Deployment
- CI/CD Pipeline
- Automated Testing