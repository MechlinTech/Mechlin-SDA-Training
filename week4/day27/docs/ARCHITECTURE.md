# AI Productivity Capstone - Architecture Documentation

## 1. Project Overview

The AI Productivity Capstone is a full-stack productivity management application that enables users to organize tasks, monitor productivity, and interact with an AI assistant powered by Google's Gemini API.

The project follows a client-server architecture where the React frontend communicates with a Node.js backend through REST APIs. MongoDB is used as the primary database, while JWT is used for secure authentication and authorization.

---

# 2. Technology Stack

## Frontend

- React.js
- Vite
- React Router DOM
- Axios
- Bootstrap 5
- Bootstrap Icons

## Backend

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- Bcrypt

## AI

- Google Gemini API

## DevOps

- Docker
- Docker Compose
- Kubernetes
- GitHub Actions

---

# 3. High-Level Architecture

                +----------------------+
                |     React Frontend   |
                +----------+-----------+
                           |
                     REST API (Axios)
                           |
                           ▼
                +----------------------+
                |   Express Backend    |
                +----------+-----------+
                           |
        +------------------+------------------+
        |                  |                  |
        ▼                  ▼                  ▼
 Authentication      Task Service       AI Service
        |                  |                  |
        ▼                  ▼                  ▼
      JWT             MongoDB Atlas      Gemini API

---

# 4. Frontend Architecture

Frontend consists of multiple pages connected using React Router.

Pages:

- Login
- Register
- Dashboard
- Tasks
- Analytics
- AI Chat

Services:

- auth.service.js
- task.service.js
- analytics.service.js
- ai.service.js

Routing:

App
 ├── Login
 ├── Register
 ├── Dashboard
 ├── Tasks
 ├── Analytics
 └── AI Chat

---

# 5. Backend Architecture

Backend follows a layered architecture.

Routes

↓

Controllers

↓

Services

↓

Models

↓

MongoDB

Folder Structure

src/
├── config
├── controllers
├── middleware
├── models
├── routes
├── services
├── utils
└── validators

---

# 6. Authentication Flow

User Login

↓

Validate Credentials

↓

Generate JWT Token

↓

Store Token (Frontend)

↓

Protected API Request

↓

JWT Verification Middleware

↓

Controller Access

---

# 7. Task Management Flow

User

↓

Create Task

↓

Express Route

↓

Task Controller

↓

MongoDB

↓

Response

↓

Frontend Update

---

# 8. AI Flow

User enters a prompt.

↓

Frontend sends request to:

POST /api/ai/chat

↓

Backend AI Controller

↓

Gemini Service

↓

Gemini API

↓

Generated Response

↓

Frontend displays response.

---

# 9. Analytics Flow

Frontend requests analytics.

↓

Analytics Controller

↓

Task Collection

↓

Calculate:

- Total Tasks
- Completed Tasks
- Pending Tasks
- Completion Percentage

↓

Return JSON

↓

Display Dashboard Cards

---

# 10. Database

Collections

Users

- name
- email
- password

Tasks

- title
- owner
- completed
- createdAt

---

# 11. Security

Implemented security features:

- JWT Authentication
- Password Hashing (bcrypt)
- Protected Routes
- Authentication Middleware
- Role Middleware
- Input Validation
- Error Handling

---

# 12. API Communication

Frontend communicates using Axios.

Example:

Frontend

↓

Axios

↓

Express API

↓

MongoDB

↓

JSON Response

---

# 13. Deployment Architecture

React Frontend

↓

Docker Container

↓

Kubernetes Service

↓

Express Backend

↓

MongoDB Atlas

---

# 14. Future Improvements

Potential enhancements include:

- React Native Application
- Flutter Application
- Push Notifications
- Redis Caching
- PostgreSQL Integration
- AI Task Recommendations
- Team Collaboration
- File Upload Support

---

# 15. Conclusion

The AI Productivity Capstone demonstrates a complete MERN-based productivity management system integrated with Google Gemini AI. The architecture is modular, scalable, and follows modern full-stack development practices with DevOps support using Docker, Kubernetes, and CI/CD.