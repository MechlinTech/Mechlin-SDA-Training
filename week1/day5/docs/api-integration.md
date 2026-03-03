# API Integration Guide -> Day 5 Mastery

Welcome to the API Integration Guide! Here, we dive deep into the real-world practices of hooking up front-end applications to back-end services. In this project, we focused on two main communication channels: **REST API** (for initial, on-demand data) and **WebSockets** (for continuous, real-time data).

---

## 🚀 1. REST API Best Practices

When fetching data using HTTP requests, simply calling `fetch()` and hoping for the best isn't enough for production. You need a robust layer:

- **Use Proper HTTP Methods**: 
  - `GET` for fetching data (no side effects).
  - `POST` for creating new resources.
  - `PUT` for fully replacing a resource.
  - `PATCH` for partially updating a resource.
  - `DELETE` for removing a resource.
  
- **Implement Error Handling**: 
  Network requests fail. Always wrap your fetches in `try/catch` blocks. Furthermore, remember that `fetch` does **not** throw an error on `404` or `500` status codes. You must manually check `if (!response.ok) throw new Error(...)`.

- **Add Request Caching**: 
  If a user visits the Dashboard, navigates away, and comes right back, there's no need to strain the server. In our `ApiService.js`, we used a fast memory cache `Map()` to instantly return fresh data if requested recently.

- **Implement Retry Logic**:
  Brief network blips happen, particularly on mobile devices. A robust API Service will use an "Exponential Backoff" strategy (e.g., retrying after 1s, then 2s, then 4s...) before finally giving up and showing an error message to the user.

- **Request Timeout**:
  Don't leave users waiting indefinitely. We wrapped our fetch inside an `AbortController` to automatically cancel requests if the server takes longer than expected (e.g., >10 seconds).

---

## ⚡ 2. WebSocket Implementation

While REST is a conversation ("Hey server, how are you?", "I'm good."), WebSockets are an open phone line. Once connected, either party can speak at any time without asking first.

- **Connection Management (Auto-Reconnect)**:
  WebSockets disconnect frequently due to proxy restarts or network drops. We built a `handleReconnect` function inside `WebSocketService.js` to automatically re-establish the connection in the background so the user never has to refresh the page.

- **Message Handling**:
  We adopted a structured `{ type, payload }` format. This allows our central WebSocket service to act like a router, parsing incoming JSON and dispatching it to specific React components that care about that data.

- **Performance Optimization (Message Queueing)**:
  If a React component tries to push a message while the socket is temporarily closed, calling `ws.send()` will crash the app natively. In our class, we intercept this, queue the message in an array, and unleash it the second the connection is restored.

- **Heartbeat & Ping/Pong Protocol**:
  Many corporate firewalls silently kill TCP connections if no bytes are transferred for ~60 seconds. To prevent this, our client automatically sends a `{"type":"ping"}` every 30 seconds, forcing the server to reply with a `{"type":"pong"}`, keeping the pipe active.

---

## 🎯 3. Real-Time Data Synchronization in React

Managing real-time data in React requires a solid understanding of Hooks so you don't leak memory or trigger infinite render loops.

- **The Dual-Strategy Approach (`useRealTimeData`)**:
  When a user opens the dashboard, they want data *now*. We don't want them waiting for the next random WebSocket broadcast.
  1. **Phase 1**: Issue a fast REST API `GET` request to paint the screen immediately.
  2. **Phase 2**: Open the WebSocket. When a new blip arrives, smoothly merge it into the existing React state to update the UI.

- **Connection Status Visibility**:
  Users need to know if they are looking at live data or stale data. We built the `ConnectionStatus.jsx` component to cleanly indicate a green, yellow, or red status, and provided manual fallback "Refresh" buttons just in case.

- **Performance Monitoring**:
  By disabling CSS animations on our incoming live Recharts data, we achieved a smooth sliding window effect without forcing the browser to recalculate heavy SVG transitions every few seconds.
