const winston = require("winston");

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
  logger.error("Application Error", {
    message: err.message,
    stack: err.stack,
    method: req.method,
    url: req.originalUrl,
  });

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    status: err.status || "error",
    message: err.message || "Internal server error",
    ...(err.details && { details: err.details }),
  });
};

module.exports = {
  AppError,
  errorHandler,
  logger,
};