# System Architecture - Advanced Dashboard

## Overview

The Advanced Dashboard is a frontend-focused React application that consumes REST APIs and simulates real-time updates using polling.

The system follows a layered architecture:

React Components → Custom Hooks → Service Layer → REST API (json-server)

---

## Technology Stack

### Frontend
- React 18
- Vite
- JavaScript ES6+
- CSS3
- Custom Hooks
- Context API (Theme)

### Backend (Mock)
- json-server
- REST API endpoints
- HTTP requests via fetch

---

## Folder Structure

week1/day4/react-dashboard/src/

components/ → UI components  
hooks/ → Custom logic hooks  
services/ → API layer  
contexts/ → Global state (ThemeContext)  

---

## Data Flow

1. User opens dashboard
2. `useDashboardData` calls API service
3. Service fetches data from json-server
4. Data stored in state
5. MetricsCard displays data
6. Polling refreshes every 5 seconds

---

## Real-Time Strategy

Since no WebSocket backend exists, real-time updates are simulated using polling every 5 seconds.

---

## Architecture Principles

- Separation of concerns
- Reusable components
- Service abstraction
- Error handling
- Retry logic with exponential backoff
- Clean folder structure