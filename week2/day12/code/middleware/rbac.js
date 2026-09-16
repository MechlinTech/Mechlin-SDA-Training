const { AppError } = require("./errorHandler");

const PERMISSIONS = {
  USER_READ: "user:read",
  USER_WRITE: "user:write",
  USER_DELETE: "user:delete",

  PRODUCT_READ: "product:read",
  PRODUCT_WRITE: "product:write",
  PRODUCT_DELETE: "product:delete",

  ORDER_READ: "order:read",
  ORDER_WRITE: "order:write",
  ORDER_DELETE: "order:delete",

  ADMIN_ACCESS: "admin:access",
};

const ROLE_PERMISSIONS = {
  user: [
    PERMISSIONS.USER_READ,
    PERMISSIONS.PRODUCT_READ,
    PERMISSIONS.ORDER_READ,
    PERMISSIONS.ORDER_WRITE,
  ],

  moderator: [
    PERMISSIONS.USER_READ,
    PERMISSIONS.PRODUCT_READ,
    PERMISSIONS.PRODUCT_WRITE,
    PERMISSIONS.ORDER_READ,
    PERMISSIONS.ORDER_WRITE,
  ],

  admin: Object.values(PERMISSIONS),
};

const hasPermission = (user, permission) => {
  if (!user || !user.role) {
    return false;
  }

  const permissions = ROLE_PERMISSIONS[user.role] || [];

  return permissions.includes(permission);
};

const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError("Authentication required", 401));
    }

    if (!hasPermission(req.user, permission)) {
      return next(
        new AppError(`Permission required: ${permission}`, 403)
      );
    }

    next();
  };
};

const requireAnyPermission = (...permissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError("Authentication required", 401));
    }

    const allowed = permissions.some((permission) =>
      hasPermission(req.user, permission)
    );

    if (!allowed) {
      return next(new AppError("Insufficient permissions", 403));
    }

    next();
  };
};

const requireAllPermissions = (...permissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError("Authentication required", 401));
    }

    const allowed = permissions.every((permission) =>
      hasPermission(req.user, permission)
    );

    if (!allowed) {
      return next(new AppError("Insufficient permissions", 403));
    }

    next();
  };
};

const requireOwnership = (getResourceUserId) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return next(new AppError("Authentication required", 401));
      }

      const resourceUserId = await getResourceUserId(req);

      if (req.user.role === "admin") {
        return next();
      }

      if (String(resourceUserId) !== String(req.user.userId)) {
        return next(new AppError("Access denied", 403));
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError("Authentication required", 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError("Insufficient role", 403));
    }

    next();
  };
};

module.exports = {
  PERMISSIONS,
  ROLE_PERMISSIONS,
  hasPermission,
  requirePermission,
  requireAnyPermission,
  requireAllPermissions,
  requireOwnership,
  requireRole,
};