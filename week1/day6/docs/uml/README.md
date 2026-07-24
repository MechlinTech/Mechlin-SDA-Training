# UML Diagrams

## Overview

This folder contains the UML diagrams created for the **Advanced React Dashboard** developed during **Week 1** of the Mechlin SDA Advanced Training Program.

These diagrams document the application's architecture, component relationships, workflow, and data movement to provide a clear understanding of the system design.

---

## Diagram List

### 1. Architecture Diagram

**Files**
- architecture-diagram.drawio
- architecture-diagram.png

**Description**

Illustrates the overall architecture of the application, including:

- Presentation Layer (React + Vite)
- State Management (Context API)
- Service Layer (DataManager)
- External API (JSONPlaceholder)
- Utility Layer

---

### 2. Component Diagram

**Files**
- component-diagram.drawio
- component-diagram.png

**Description**

Represents the hierarchy and relationships between React components.

Includes:

- App.jsx
- ErrorBoundary
- DataProvider
- Dashboard
- DashboardHeader
- MetricsGrid
- MetricsCard
- ChartContainer
- PerformanceMonitor
- LoadingSpinner
- ErrorMessage

---

### 3. Sequence Diagram

**Files**
- sequence-diagram.drawio
- sequence-diagram.png

**Description**

Shows the interaction between application components during data retrieval.

Flow:

User → Dashboard → DataContext → DataManager → JSONPlaceholder API → Dashboard

---

### 4. Activity Diagram

**Files**
- activity-diagram.drawio
- activity-diagram.png

**Description**

Illustrates the workflow of the dashboard from application startup to rendering metrics and charts, including loading, API communication, state updates, and error handling.

---

### 5. Data Flow Diagram

**Files**
- dataflow-diagram.drawio
- dataflow-diagram.png

**Description**

Shows how data moves through the application.

Flow:

User → Dashboard → DataContext → DataManager → JSONPlaceholder API → Utility Functions → Dashboard Components → User

---

## Technologies Used

- React
- Vite
- Context API
- JavaScript (ES6+)
- REST API
- JSONPlaceholder
- draw.io (diagrams.net)

---

## Purpose

These UML diagrams provide a visual representation of the application's architecture and behavior. They improve system understanding, simplify maintenance, support onboarding of new developers, and serve as technical documentation for the project.