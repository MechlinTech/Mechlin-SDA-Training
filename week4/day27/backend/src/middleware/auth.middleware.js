/**
 * ==========================================================
 * File: middleware/auth.middleware.js
 * Purpose:
 * This middleware authenticates users by verifying the JWT
 * token sent in the Authorization header.
 *
 * Header Format:
 * Authorization: Bearer <jwt_token>
 *
 * If the token is valid:
 * - Decodes the token
 * - Attaches user data to req.user
 * - Calls next()
 *
 * If invalid or missing:
 * - Returns 401 Unauthorized
 * ==========================================================
 */

const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
  try {
    // Get Authorization header
    const authHeader = req.headers.authorization;

    // Check if header exists
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authorization header is missing.",
      });
    }

    // Check Bearer token format
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Invalid authorization format.",
      });
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded user information
    req.user = decoded;

    // Continue to next middleware
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token has expired.",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Authentication failed.",
      error: error.message,
    });
  }
};

module.exports = authenticateUser;