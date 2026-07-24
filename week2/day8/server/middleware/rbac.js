/**
 * ============================================================================
 * Role Based Access Control (RBAC)
 * ============================================================================
 *
 * Responsibilities:
 * - Allow access only to specific roles
 * - Protect admin/moderator routes
 * - Return proper authorization errors
 *
 * Usage:
 *
 * router.get(
 *    "/admin",
 *    authenticate,
 *    authorize("admin"),
 *    controller
 * );
 *
 * router.post(
 *    "/products",
 *    authenticate,
 *    authorize("admin", "moderator"),
 *    controller
 * );
 *
 * ============================================================================
 */

const { AppError } = require("./errorHandler");

/**
 * ============================================================================
 * Authorize User
 * ============================================================================
 */

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(
        new AppError("Authentication required.", 401)
      );
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new AppError(
          "You are not authorized to access this resource.",
          403
        )
      );
    }

    next();
  };
};

/**
 * ============================================================================
 * Exports
 * ============================================================================
 */

module.exports = {
  authorize,
};