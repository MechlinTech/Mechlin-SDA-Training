# React Architecture

## 1. Component Structure

The application is divided into reusable React components.

Main components:

- Dashboard
- MetricsCard
- ChartContainer
- PerformanceMonitor
- ErrorBoundary

This structure makes the application easier to maintain and reuse.

## 2. State Management

The dashboard uses React's `useReducer` hook for managing complex state.

The reducer handles:

- Loading state
- Error state
- Dashboard data
- Filters

`useState` is used for simpler component-level state.

## 3. Context API

`DataContext` provides shared data and functions to components without passing props through multiple component levels.

The context provides:

- Dashboard data
- Loading state
- Error state
- Data fetching
- Cache clearing

## 4. Custom Hooks

The application uses reusable custom hooks:

### useDataFetching

Handles asynchronous data fetching, loading states, errors, and refetching.

### useLocalStorage

Stores and retrieves values from browser localStorage.

### useDebounce

Delays updates until the user stops changing a value for a specified period.

### usePerformance

Collects basic application performance information such as load time, interactions, and memory usage.

## 5. Error Handling

The `ErrorBoundary` component catches rendering errors in child components and displays a user-friendly error message.

Users can click **Try Again** to retry rendering the component tree.

## 6. Performance Optimization

`MetricsCard` uses `React.memo` to avoid unnecessary re-renders.

`useMemo` is used for calculated values such as:

- Formatted metric values
- Percentage change classes

The application also destroys existing Chart.js instances before creating new ones to avoid canvas reuse errors.

## 7. Data Flow

The basic data flow is:

User Interface
↓
Dashboard
↓
DataContext
↓
Data Fetching
↓
State Update
↓
Reusable Components
↓
Charts and Metrics

## 8. Technologies Used

- React
- React Hooks
- Context API
- Chart.js
- PropTypes
- Vite
- JavaScript ES6+