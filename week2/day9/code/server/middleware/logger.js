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

const loggerMiddleware = (req, res, next) => {
  logger.info("HTTP Request", {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
  });

  next();
};

module.exports = loggerMiddleware;