# API Integration - Day 5

## Overview
This dashboard integrates with a mock REST API using json-server.

## Features Implemented

- REST API consumption using fetch
- Service layer abstraction (`api.js`)
- Retry logic with exponential backoff
- Parallel data fetching using Promise.all
- Auto-refresh polling every 5 seconds
- Loading skeleton UI
- Error handling with retry feedback
- Last updated timestamp
- Dark mode support
- Performance tracking hook

## Architecture

React Component → Custom Hook → Service Layer → REST API

## Real-Time Strategy

Since no WebSocket backend exists, real-time updates are simulated using polling every 5 seconds.

## Error Handling

- HTTP status validation
- Retry mechanism (3 attempts)
- Exponential backoff
- Graceful UI fallback