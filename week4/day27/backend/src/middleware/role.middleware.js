/**
 * ==========================================================
 * File: middleware/role.middleware.js
 * Purpose:
 * Role-Based Authorization Middleware
 * Allows access only to users with the specified roles.
 * ==========================================================
 */

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please login first.",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You do not have permission to access this resource.",
      });
    }

    next();
  };
};

module.exports = authorizeRoles;