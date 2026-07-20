const jwt = require("jsonwebtoken");
const { AppError } = require("./errorHandler");

/**
 * ============================================================================
 * Authentication & Authorization Middleware
 * ============================================================================
 *
 * This file contains reusable middleware functions for securing API routes.
 *
 * Middleware Included:
 *
 * 1. authenticate()
 *    - Verifies JWT token.
 *    - Ensures the user is logged in.
 *    - Attaches decoded user information to req.user.
 *
 * 2. authorize(...roles)
 *    - Restricts access based on user roles.
 *    - Example: Admin-only routes.
 *
 * 3. optionalAuth()
 *    - Authentication is optional.
 *    - If a valid token exists, req.user is populated.
 *    - Otherwise, the request continues as a guest user.
 *
 * ============================================================================
 */

/**
 * ============================================================================
 * authenticate()
 * ----------------------------------------------------------------------------
 * Protects private routes.
 *
 * Expected Header:
 * Authorization: Bearer <JWT_TOKEN>
 *
 * Flow:
 * Client
 *    │
 *    ▼
 * Check Authorization Header
 *    │
 * Verify JWT Token
 *    │
 * Attach User to req.user
 *    │
 * next()
 * ============================================================================
 */
const authenticate = (req, res, next) => {
  try {
    // Read Authorization header
    const authHeader = req.headers.authorization;

    // Token not provided
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(new AppError("Authentication token is missing", 401));
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    // Verify token using secret key
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "mechlin-secret-key"
    );

    // Store logged-in user details
    req.user = decoded;

    next();
  } catch (error) {
    return next(new AppError("Invalid or expired token", 401));
  }
};

/**
 * ============================================================================
 * authorize()
 * ----------------------------------------------------------------------------
 * Restricts routes based on user role.
 *
 * Example:
 *
 * router.delete(
 *    "/users/:id",
 *    authenticate,
 *    authorize("admin"),
 *    deleteUser
 * );
 *
 * Only users having role "admin" can access the route.
 * ============================================================================
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    // authenticate() must run before authorize()
    if (!req.user) {
      return next(new AppError("Unauthorized", 401));
    }

    // Check if user's role is allowed
    if (!roles.includes(req.user.role)) {
      return next(new AppError("Access denied", 403));
    }

    next();
  };
};

/**
 * ============================================================================
 * optionalAuth()
 * ----------------------------------------------------------------------------
 * Used for routes where login is optional.
 *
 * Example:
 *
 * GET /products
 *
 * Guest User  -> Products Visible
 * Logged User -> Products Visible + Personalized Information
 *
 * If token exists:
 *      req.user will be available.
 *
 * If token does not exist:
 *      Request continues normally.
 * ============================================================================
 */
const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // No token → Continue as guest
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next();
    }

    const token = authHeader.split(" ")[1];

    // Decode token if available
    req.user = jwt.verify(
      token,
      process.env.JWT_SECRET || "mechlin-secret-key"
    );

    next();
  } catch (error) {
    // Ignore invalid token and continue as guest
    next();
  }
};

module.exports = {
  authenticate,
  authorize,
  optionalAuth,
};