const jwt = require("jsonwebtoken");
const { AppError } = require("./errorHandler");

const authMiddleware = (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      throw new AppError("Access token required", 401);
    }

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");

    req.user = decoded;
    next();
  } catch (err) {
    next(new AppError("Invalid or expired token", 401));
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("Forbidden", 403));
    }
    next();
  };
};

module.exports = { authMiddleware, authorize };