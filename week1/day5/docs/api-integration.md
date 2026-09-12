# Day 5: API & Real-Time Data Integration

## 1. Overview

Day 5 focuses on integrating REST APIs and WebSockets into a React application.

The dashboard uses an API service layer for data fetching, caching, retry handling, and error handling. WebSocket integration is used to receive real-time updates without continuously requesting the server.

---

## 2. API Service Layer

The API service is implemented in:

```text
src/services/ApiService.js