const { logger } = require("./errorHandler");

const performanceMiddleware = (req, res, next) => {
  const startTime = process.hrtime.bigint();

  res.on("finish", () => {
    const endTime = process.hrtime.bigint();
    const duration = Number(endTime - startTime) / 1_000_000;

    logger.info({
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration.toFixed(2)} ms`,
    });

    if (duration > 1000) {
      logger.warn(
        `Slow request detected: ${req.method} ${req.originalUrl} (${duration.toFixed(
          2
        )} ms)`
      );
    }
  });

  next();
};

module.exports = performanceMiddleware;