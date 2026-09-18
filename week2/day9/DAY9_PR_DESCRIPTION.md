# Day 9: Express & Middleware

## 🚀 Overview
This PR completes Day 9 of the SDA training, focusing heavily on Express.js architecture and advanced middleware patterns. By building out custom route handlers and integrating powerful third-party tools, the API is now highly secure, structurally organized, and robust against bad inputs.

## 🛠️ Tasks Completed
- [x] **Task 1: Express App Configuration**: Created `server/app.js` encapsulating an object-oriented Express server. Configured essential security and performance middleware including `helmet`, `cors`, `compression`, and `express-rate-limit`. 
- [x] **Task 2: Authentication Middleware**: Built `middleware/auth.js` providing stateless JWT verification, role-based access control (RBAC) via the `authorize` closure, and flexible optional authentication routes.
- [x] **Task 3: Validation Middleware**: Implemented `middleware/validation.js` leveraging `express-validator` to enforce strict schema types and shapes for Users, Logins, Products, Orders, and Pagination parameters.
- [x] **Task 4: Route Handlers**: Created modular route controllers in `routes/userRoutes.js`, tying together the validation schemas, authentication gates, and underlying user services.
- [x] **Task 5: Global Error Handling**: Upgraded the previous `errorHandler.js` to catch JWT expiration, invalid signatures, rate limit hits, and map them cleanly to standard HTTP status codes.
- [x] **Documentation**: Added `docs/express-architecture.md` outlining best practices for Express middleware ordering, security prioritization, and modular routing.

## 🎯 Next Steps
- Move on to Day 10 to wire these structured Express routes to our fully configured MongoDB and PostgreSQL databases!
