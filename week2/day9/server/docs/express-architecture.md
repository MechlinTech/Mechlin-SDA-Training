# Express.js Architecture Guide

## Application Structure
- index.js handles clustering
- app.js handles Express setup
- routes folder contains modular route handlers
- middleware folder contains custom middleware
- services folder contains business logic

## Middleware Order
1. Security (helmet, cors)
2. Compression
3. Logging
4. Performance
5. Rate limiting
6. Routes
7. 404 handler
8. Error handler (last)

## Authentication Flow
- User logs in → JWT generated
- Token sent in Authorization header
- authMiddleware verifies token
- authorize middleware checks role
- Route executes

## Validation
- express-validator used
- handleValidation middleware checks errors
- AppError thrown if invalid

## Error Handling
- Centralized errorHandler
- Returns consistent JSON response
- Prevents server crash

## Key Learnings
- Middleware order matters
- Separation of concerns is critical
- Always centralize error handling
- Never trust client input