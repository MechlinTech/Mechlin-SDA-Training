# Day 27 Backend API Documentation

## Authentication

POST /api/auth/register
POST /api/auth/login

---

## Users

GET /api/users/profile

Authorization:
Bearer <token>

---

## Tasks

POST /api/tasks

GET /api/tasks

GET /api/tasks/:id

PUT /api/tasks/:id

DELETE /api/tasks/:id

---

## Analytics

GET /api/analytics

---

## AI

POST /api/ai/chat

POST /api/ai/generate

POST /api/ai/summarize

POST /api/ai/recommendations