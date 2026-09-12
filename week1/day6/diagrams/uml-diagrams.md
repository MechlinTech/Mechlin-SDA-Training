# UML Diagrams

This document contains UML diagrams for the SDA Training application.

---

## 1. Use Case Diagram

```mermaid
flowchart LR

    User((User))

    User --> Login[Login]
    User --> Dashboard[View Dashboard]
    User --> Metrics[View Metrics]
    User --> Refresh[Refresh Data]
    User --> RealTime[Receive Real-Time Updates]
    User --> Connection[Check Connection Status]
```

---

## 2. Class Diagram

```mermaid
classDiagram

    class ApiService {
        -baseURL
        -cache
        -retryAttempts
        -retryDelay
        -timeout
        +get(endpoint)
        +post(endpoint, data)
        +put(endpoint, data)
        +delete(endpoint, data)
        +clearCache()
        +getCacheSize()
        +subscribe()
    }

    class WebSocketService {
        -url
        -socket
        -reconnectAttempts
        -subscriptions
        +connect()
        +disconnect()
        +send()
        +subscribe()
        +reconnect()
    }

    class useRealTimeData {
        +data
        +loading
        +error
        +isConnected
        +refresh()
        +getLastUpdate()
    }

    class RealTimeDashboard {
        +displayMetrics()
        +displayCharts()
        +refreshData()
    }

    class ConnectionStatus {
        +status
        +onReconnect()
        +showDetails()
    }

    RealTimeDashboard --> useRealTimeData
    RealTimeDashboard --> ConnectionStatus
    useRealTimeData --> ApiService
    useRealTimeData --> WebSocketService
```

---

## 3. System Architecture Diagram

```mermaid
flowchart TD

    User[User]

    Frontend[React Frontend]
    Components[React Components]
    Hooks[Custom Hooks]
    Services[Service Layer]

    API[ApiService]
    WS[WebSocketService]

    REST[REST API]
    WSS[WebSocket Server]
    Database[(Database)]

    User --> Frontend
    Frontend --> Components
    Components --> Hooks
    Hooks --> Services

    Services --> API
    Services --> WS

    API --> REST
    REST --> Database
    Database --> REST
    REST --> API

    WS --> WSS
    WSS --> WS

    API --> Components
    WS --> Components
```

---

## 4. API Request Sequence Diagram

```mermaid
sequenceDiagram

    participant User
    participant Dashboard
    participant Hook as useRealTimeData
    participant API as ApiService
    participant Server as REST API

    User->>Dashboard: Open Dashboard
    Dashboard->>Hook: Request Data
    Hook->>API: GET /api/revenue

    API->>API: Check Cache

    alt Cached Data Available
        API-->>Hook: Return Cached Data
    else Cache Miss
        API->>Server: HTTP GET Request
        Server-->>API: Return Data
        API->>API: Store Data in Cache
        API-->>Hook: Return Data
    end

    Hook-->>Dashboard: Update State
    Dashboard-->>User: Display Data
```

---

## 5. WebSocket Sequence Diagram

```mermaid
sequenceDiagram

    participant Server as WebSocket Server
    participant WS as WebSocketService
    participant Hook as useRealTimeData
    participant Dashboard
    participant User

    Server->>WS: Send dataUpdate
    WS->>Hook: Notify Subscriber
    Hook->>Hook: Update State
    Hook->>Dashboard: Updated Data
    Dashboard-->>User: Update UI
```

---

## 6. Authentication Sequence Diagram

```mermaid
sequenceDiagram

    participant User
    participant Frontend
    participant Backend
    participant Auth as Authentication
    participant Database

    User->>Frontend: Enter Login Credentials
    Frontend->>Backend: Send Login Request
    Backend->>Database: Verify User
    Database-->>Backend: User Details

    Backend->>Auth: Generate JWT
    Auth-->>Backend: JWT Token
    Backend-->>Frontend: Return JWT Token
    Frontend-->>User: Login Successful

    User->>Frontend: Request Protected Resource
    Frontend->>Backend: Request + JWT Token
    Backend->>Auth: Validate JWT
    Auth-->>Backend: Token Valid
    Backend-->>Frontend: Return Protected Data
    Frontend-->>User: Display Data
```

---

## 7. Data Flow Diagram

```mermaid
flowchart TD

    User[User]

    UI[React Dashboard]
    Hooks[Custom React Hooks]

    API[ApiService]
    WS[WebSocketService]

    REST[REST API]
    Server[WebSocket Server]
    DB[(Database)]

    User --> UI
    UI --> Hooks

    Hooks --> API
    Hooks --> WS

    API --> REST
    REST --> DB
    DB --> REST
    REST --> API
    API --> UI

    WS --> Server
    Server --> WS
    WS --> UI

    UI --> User
```

---

## 8. Error Handling Flow Diagram

```mermaid
flowchart TD

    Start[Send API Request]

    Start --> Check{Request Successful?}

    Check -->|Yes| Success[Return Data]

    Check -->|No| Error[Handle Error]

    Error --> RetryCheck{Retry Available?}

    RetryCheck -->|Yes| Retry[Retry Request]
    Retry --> Start

    RetryCheck -->|No| Failure[Return Error]

    Failure --> Message[Display Error Message]
```

---

## 9. WebSocket Connection and Reconnection Flow

```mermaid
flowchart TD

    Start[Start Application]

    Start --> Connect[Connect to WebSocket]

    Connect --> Check{Connection Successful?}

    Check -->|Yes| Connected[Connected]

    Connected --> Receive[Receive Real-Time Data]
    Receive --> Update[Update Dashboard]
    Update --> Receive

    Check -->|No| Retry[Attempt Reconnection]

    Retry --> Limit{Maximum Attempts Reached?}

    Limit -->|No| Connect
    Limit -->|Yes| Disconnected[Disconnected]

    Disconnected --> Status[Show Disconnected Status]

    Status --> Reconnect[User Selects Reconnect]

    Reconnect --> Connect
```

---

## 10. API and WebSocket Relationship Diagram

```mermaid
flowchart LR

    Dashboard[Real-Time Dashboard]

    APIService[ApiService]
    WSService[WebSocketService]

    RESTAPI[REST API]
    WSServer[WebSocket Server]

    Database[(Database)]

    Dashboard --> APIService
    Dashboard --> WSService

    APIService --> RESTAPI
    RESTAPI --> Database
    Database --> RESTAPI
    RESTAPI --> APIService

    WSService <--> WSServer

    APIService --> Dashboard
    WSService --> Dashboard
```

---

## Summary

The UML documentation contains:

1. Use Case Diagram
2. Class Diagram
3. System Architecture Diagram
4. API Request Sequence Diagram
5. WebSocket Sequence Diagram
6. Authentication Sequence Diagram
7. Data Flow Diagram
8. Error Handling Flow Diagram
9. WebSocket Connection and Reconnection Flow
10. API and WebSocket Relationship Diagram