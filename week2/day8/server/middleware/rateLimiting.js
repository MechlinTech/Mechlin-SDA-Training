// =============================================================================
// File: rateLimiting.js
//
// Purpose:
// Centralized rate limiting configuration for the application.
//
// Responsibilities:
// - Protect APIs from abuse
// - Prevent brute-force attacks
// - Limit expensive API usage
// - Return consistent error responses
//
// Importance:
// - Improves security
// - Prevents server overload
// - Production-ready rate limiting
// =============================================================================

const rateLimit = require("express-rate-limit");

// -----------------------------------------------------------------------------
// General API Limiter
// -----------------------------------------------------------------------------
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 Minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again after 15 minutes.",
  },
});

// -----------------------------------------------------------------------------
// Login Limiter
// -----------------------------------------------------------------------------
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many login attempts. Please try again later.",
  },
});

// -----------------------------------------------------------------------------
// Strict Limiter
// -----------------------------------------------------------------------------
const strictLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Rate limit exceeded.",
  },
});

// -----------------------------------------------------------------------------
// Analytics / Heavy API Limiter
// -----------------------------------------------------------------------------
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many analytics requests.",
  },
});

module.exports = {
  generalLimiter,
  loginLimiter,
  strictLimiter,
  apiLimiter,
};