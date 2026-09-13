const winston = require("winston");

// Logger
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    }),
    new winston.transports.File({
      filename: "logs/combined.log",
    }),
  ],
});

class AppError extends Error {
  constructor(message, statusCode = 500, details = null) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4")
      ? "fail"
      : "error";
    this.isOperational = true;
    this.details = details;

    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  logger.error("Application Error", {
    message: err.message,
    stack: err.stack,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
  });

  if (err.name === "CastError") {
    error = new AppError("Invalid resource ID", 400);
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0];

    error = new AppError(
      `Duplicate value for field: ${field}`,
      400
    );
  }

  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map(
      (value) => value.message
    );

    error = new AppError(
      "Validation failed",
      400,
      messages
    );
  }

  if (err.name === "JsonWebTokenError") {
    error = new AppError("Invalid token", 401);
  }

  if (err.name === "TokenExpiredError") {
    error = new AppError("Token expired", 401);
  }

  if (err.status === 429) {
    error = new AppError(
      "Too many requests, please try again later.",
      429
    );
  }

  const statusCode = error.statusCode || 500;

  const response = {
    success: false,
    status: error.status || "error",
    message: error.message || "Internal server error",
  };

  if (error.details) {
    response.details = error.details;
  }

  if (process.env.NODE_ENV === "development") {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

module.exports = {
  AppError,
  errorHandler,
  logger,
};