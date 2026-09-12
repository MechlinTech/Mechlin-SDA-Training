# API Documentation

## Overview

The Advanced Dashboard provides REST API endpoints for retrieving and managing users, revenue data, and order information.

The API also provides WebSocket communication for real-time dashboard updates.

---

## Base URL

```text
https://api.dashboard.com/v1
```

---

## Authentication

All API requests require authentication via a JWT token in the `Authorization` header.

```http
Authorization: Bearer <jwt_token>
```

### Authentication Example

```text
Authorization: Bearer your_jwt_token
```

---

# Endpoints

## 1. Users

### GET /users

Retrieve all users with pagination and filtering.

**Endpoint:**

```http
GET /users
```

### Parameters

| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| `page` | integer | No | 1 | Page number |
| `limit` | integer | No | 10 | Items per page |
| `search` | string | No | - | Search query |
| `sort` | string | No | `createdAt` | Sort field |
| `order` | string | No | `asc` | Sort order (`asc` or `desc`) |

### Request Example

```http
GET /users?page=1&limit=10&search=John&sort=createdAt&order=desc
Authorization: Bearer <jwt_token>
```

### Response

```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "user_123",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "admin",
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "pages": 10
    }
  }
}
```

---

## 2. Create User

### POST /users

Create a new user.

**Endpoint:**

```http
POST /users
```

### Request Body

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "role": "user",
  "password": "securepassword"
}
```

### Request Example

```http
POST /users
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

### Response

```json
{
  "success": true,
  "data": {
    "id": "user_456",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "user",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

---

# 3. Revenue

## GET /revenue

Retrieve revenue data with time-range filtering.

**Endpoint:**

```http
GET /revenue
```

### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `startDate` | string | Yes | Start date in ISO format |
| `endDate` | string | Yes | End date in ISO format |
| `granularity` | string | No | `daily`, `weekly`, or `monthly` |

### Request Example

```http
GET /revenue?startDate=2024-01-01&endDate=2024-01-31&granularity=daily
Authorization: Bearer <jwt_token>
```

### Response

```json
{
  "success": true,
  "data": {
    "total": 45678.90,
    "change": 12.5,
    "trend": "up",
    "data": [
      {
        "date": "2024-01-01",
        "revenue": 1234.56,
        "transactions": 45
      }
    ]
  }
}
```

---

# 4. Orders

## GET /orders

Retrieve order data with filtering and sorting.

**Endpoint:**

```http
GET /orders
```

### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `status` | string | No | Order status filter |
| `dateRange` | string | No | Date range filter |
| `sort` | string | No | Sort field |

### Request Example

```http
GET /orders?status=completed&sort=createdAt
Authorization: Bearer <jwt_token>
```

### Response

```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": "order_123",
        "customerId": "customer_456",
        "total": 99.99,
        "status": "completed",
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "summary": {
      "total": 100,
      "completed": 85,
      "pending": 10,
      "cancelled": 5
    }
  }
}
```

---

# Error Responses

## 400 Bad Request

Returned when the request contains invalid input parameters.

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input parameters",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

---

## 401 Unauthorized

Returned when authentication is missing or invalid.

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required"
  }
}
```

---

## 404 Not Found

Returned when the requested resource does not exist.

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Resource not found"
  }
}
```

---

## 500 Internal Server Error

Returned when an unexpected server-side error occurs.

```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An unexpected error occurred"
  }
}
```

---

# Rate Limiting

The API uses rate limiting to prevent excessive requests.

- **1000 requests per hour per IP**
- **100 requests per minute per user**
- Rate-limit headers are included in responses

Rate limiting helps protect the API from excessive traffic and improves system stability.

---

# WebSocket Events

The application supports WebSocket communication for real-time data updates.

## Connection

```javascript
const ws = new WebSocket('wss://api.dashboard.com/ws');
```

---

## Supported Events

| Event | Description |
|---|---|
| `connected` | Connection established |
| `disconnected` | Connection lost |
| `dataUpdate` | Real-time data update |
| `error` | Error occurred |

---

## Connected Event

The `connected` event indicates that the WebSocket connection has been established.

```json
{
  "type": "connected",
  "message": "WebSocket connection established"
}
```

---

## Disconnected Event

The `disconnected` event indicates that the WebSocket connection has been lost.

The client can attempt to reconnect when this event occurs.

---

## Data Update Event

The `dataUpdate` event is used to send real-time dashboard data to connected clients.

### Example

```json
{
  "type": "dataUpdate",
  "payload": {
    "endpoint": "/api/revenue",
    "data": {
      "labels": [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun"
      ],
      "values": [
        12000,
        18000,
        24000,
        31000,
        39000,
        47000
      ]
    }
  }
}
```

---

## Error Event

The `error` event indicates that an error occurred during WebSocket communication.

The client should handle the error and attempt reconnection when appropriate.

---

# WebSocket Example

```javascript
const ws = new WebSocket('wss://api.dashboard.com/ws');

ws.onopen = () => {
  console.log('Connected to WebSocket');
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);

  if (data.type === 'dataUpdate') {
    updateDashboard(data.payload);
  }
};

ws.onerror = (error) => {
  console.error('WebSocket error:', error);
};

ws.onclose = () => {
  console.log('WebSocket connection closed');
};
```

---

# API Response Format

## Successful Response

```json
{
  "success": true,
  "data": {}
}
```

## Error Response

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description"
  }
}
```

---

# API Documentation Summary

The API provides:

- JWT-based authentication
- User management
- Revenue data retrieval
- Order data retrieval
- Pagination and filtering
- Standard HTTP error responses
- Rate limiting
- WebSocket-based real-time updates

The REST API is used for normal data retrieval and management, while WebSocket communication is used for real-time dashboard updates.