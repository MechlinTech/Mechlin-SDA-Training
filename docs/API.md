# API Documentation

## Overview

This document provides comprehensive API documentation for the SDA Training Program applications and services.

## Base URLs

- **Development**: `http://localhost:5000/api/v1`
- **Staging**: `https://staging-api.sda-training.com/api/v1`
- **Production**: `https://api.sda-training.com/api/v1`

## Authentication

### JWT Token Authentication

All API endpoints require authentication using JWT tokens.

```bash
Authorization: Bearer <your-jwt-token>
```

### Getting a Token

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "your-password"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-id",
      "name": "User Name",
      "email": "user@example.com",
      "role": "student"
    },
    "token": "jwt-token-here"
  }
}
```

## Endpoints

### Authentication

#### POST /auth/login
Login with email and password.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": "User object",
    "token": "string"
  }
}
```

#### POST /auth/logout
Logout and invalidate token.

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### GET /auth/me
Get current user information.

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "string",
    "createdAt": "datetime",
    "updatedAt": "datetime"
  }
}
```

### Users

#### GET /users
Get list of users with pagination.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search term
- `role` (optional): Filter by role

**Response:**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "string",
        "name": "string",
        "email": "string",
        "role": "string",
        "createdAt": "datetime"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "totalPages": 10
    }
  }
}
```

#### GET /users/:id
Get user by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "string",
    "createdAt": "datetime",
    "updatedAt": "datetime"
  }
}
```

#### PUT /users/:id
Update user information.

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "role": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "string",
    "updatedAt": "datetime"
  }
}
```

### Tasks

#### GET /tasks
Get list of tasks.

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page
- `status` (optional): Filter by status
- `priority` (optional): Filter by priority
- `assignee` (optional): Filter by assignee

**Response:**
```json
{
  "success": true,
  "data": {
    "tasks": [
      {
        "id": "string",
        "title": "string",
        "description": "string",
        "status": "string",
        "priority": "string",
        "assignee": "User object",
        "createdAt": "datetime",
        "updatedAt": "datetime"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "totalPages": 10
    }
  }
}
```

#### POST /tasks
Create a new task.

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "priority": "low|medium|high",
  "assignee": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "title": "string",
    "description": "string",
    "status": "pending",
    "priority": "string",
    "assignee": "User object",
    "createdAt": "datetime"
  }
}
```

#### PUT /tasks/:id
Update a task.

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "status": "pending|in-progress|completed",
  "priority": "low|medium|high"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "title": "string",
    "description": "string",
    "status": "string",
    "priority": "string",
    "updatedAt": "datetime"
  }
}
```

#### DELETE /tasks/:id
Delete a task.

**Response:**
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

### AI Services

#### POST /ai/chat
Chat with AI assistant.

**Request Body:**
```json
{
  "message": "string",
  "conversation_history": [
    {
      "role": "user|assistant",
      "content": "string"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "response": "string",
  "conversation_history": [
    {
      "role": "user|assistant",
      "content": "string"
    }
  ],
  "metadata": {
    "model": "string",
    "tokens_used": "number",
    "response_time": "number"
  }
}
```

#### POST /ai/generate
Generate content using AI.

**Request Body:**
```json
{
  "content_type": "article|blog-post|social-media|email|product-description",
  "topic": "string",
  "tone": "professional|casual|friendly|formal|creative",
  "length": "short|medium|long",
  "keywords": ["string"]
}
```

**Response:**
```json
{
  "success": true,
  "content": "string",
  "metadata": {
    "content_type": "string",
    "topic": "string",
    "tone": "string",
    "length": "string",
    "keywords": ["string"],
    "word_count": "number",
    "generation_time": "number"
  }
}
```

#### POST /ai/summarize
Summarize text using AI.

**Request Body:**
```json
{
  "text": "string",
  "max_length": "number"
}
```

**Response:**
```json
{
  "success": true,
  "summary": "string",
  "metadata": {
    "original_length": "number",
    "summary_length": "number",
    "compression_ratio": "number",
    "generation_time": "number"
  }
}
```

#### POST /ai/recommendations
Get AI-powered recommendations.

**Request Body:**
```json
{
  "user_profile": {
    "interests": ["string"],
    "preferences": "object",
    "history": "object"
  },
  "max_recommendations": "number"
}
```

**Response:**
```json
{
  "success": true,
  "recommendations": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "category": "string",
      "score": "number",
      "url": "string",
      "image": "string"
    }
  ],
  "metadata": {
    "total_recommendations": "number",
    "generation_time": "number",
    "model_used": "string"
  }
}
```

### Analytics

#### GET /analytics
Get analytics data.

**Query Parameters:**
- `time_range` (optional): Time range for analytics (default: 30d)

**Response:**
```json
{
  "success": true,
  "analytics": {
    "usage_stats": {
      "total_users": "number",
      "active_users": "number",
      "total_tasks": "number",
      "completed_tasks": "number"
    },
    "performance_metrics": {
      "average_response_time": "number",
      "uptime_percentage": "number",
      "error_rate": "number"
    },
    "user_insights": {
      "most_active_users": ["User objects"],
      "popular_features": ["string"],
      "usage_trends": "object"
    },
    "recommendations": {
      "improvements": ["string"],
      "optimizations": ["string"]
    }
  }
}
```

## Error Handling

### Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "string",
    "message": "string",
    "details": "object"
  }
}
```

### Common Error Codes

- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `429` - Too Many Requests
- `500` - Internal Server Error

### Example Error Response

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "email",
      "message": "Invalid email format"
    }
  }
}
```

## Rate Limiting

API requests are rate limited to prevent abuse:

- **Authentication endpoints**: 5 requests per minute
- **AI endpoints**: 10 requests per minute
- **General endpoints**: 100 requests per minute

Rate limit headers are included in responses:
- `X-RateLimit-Limit`: Request limit per window
- `X-RateLimit-Remaining`: Remaining requests in current window
- `X-RateLimit-Reset`: Time when the rate limit resets

## WebSocket Events

### Connection

```javascript
const socket = io('ws://localhost:5000', {
  auth: {
    token: 'your-jwt-token'
  }
});
```

### Events

#### `task_created`
Emitted when a new task is created.

```json
{
  "task": {
    "id": "string",
    "title": "string",
    "description": "string",
    "status": "string",
    "priority": "string",
    "assignee": "User object",
    "createdAt": "datetime"
  }
}
```

#### `task_updated`
Emitted when a task is updated.

```json
{
  "task": {
    "id": "string",
    "title": "string",
    "description": "string",
    "status": "string",
    "priority": "string",
    "updatedAt": "datetime"
  }
}
```

#### `notification`
Emitted when a notification is sent.

```json
{
  "type": "info|success|warning|error",
  "title": "string",
  "message": "string",
  "timestamp": "datetime"
}
```

## SDKs and Libraries

### JavaScript/Node.js

```bash
npm install sda-training-sdk
```

```javascript
import { SDATrainingAPI } from 'sda-training-sdk';

const api = new SDATrainingAPI({
  baseURL: 'https://api.sda-training.com',
  token: 'your-jwt-token'
});

// Get tasks
const tasks = await api.tasks.list();

// Create task
const task = await api.tasks.create({
  title: 'New Task',
  description: 'Task description',
  priority: 'high'
});
```

### Python

```bash
pip install sda-training-python
```

```python
from sda_training import SDATrainingAPI

api = SDATrainingAPI(
    base_url='https://api.sda-training.com',
    token='your-jwt-token'
)

# Get tasks
tasks = api.tasks.list()

# Create task
task = api.tasks.create({
    'title': 'New Task',
    'description': 'Task description',
    'priority': 'high'
})
```

## Testing

### Postman Collection

Import our Postman collection for easy API testing:
[Download Collection](https://api.sda-training.com/postman/collection.json)

### cURL Examples

#### Login
```bash
curl -X POST https://api.sda-training.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password"}'
```

#### Get Tasks
```bash
curl -X GET https://api.sda-training.com/api/v1/tasks \
  -H "Authorization: Bearer your-jwt-token"
```

#### Create Task
```bash
curl -X POST https://api.sda-training.com/api/v1/tasks \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{"title": "New Task", "description": "Task description", "priority": "high"}'
```

## Support

For API support and questions:
- **Email**: api-support@mechlin.tech
- **Documentation**: https://docs.sda-training.com
- **GitHub Issues**: https://github.com/mechlin-tech/sda-training/issues
