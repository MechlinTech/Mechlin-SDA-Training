const { performance, PerformanceObserver } = require("perf_hooks");
const logger = require("./logger");

const performanceObserver = new PerformanceObserver((list) => {
  const entries = list.getEntries();

  entries.forEach((entry) => {
    logger.info({
      type: "performance",
      name: entry.name,
      duration: `${entry.duration.toFixed(2)}ms`,
    });
  });
});

performanceObserver.observe({ entryTypes: ["measure"] });

function performanceMiddleware(req, res, next) {
  const startTime = performance.now();

  res.on("finish", () => {
    const duration = performance.now() - startTime;

    logger.info({
      type: "request-performance",
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration.toFixed(2)}ms`,
      memory: process.memoryUsage(),
    });
  });

  next();
}

function getPerformanceMetrics() {
  const memory = process.memoryUsage();

  return {
    uptime: process.uptime(),
    memory: {
      rss: `${(memory.rss / 1024 / 1024).toFixed(2)} MB`,
      heapTotal: `${(memory.heapTotal / 1024 / 1024).toFixed(2)} MB`,
      heapUsed: `${(memory.heapUsed / 1024 / 1024).toFixed(2)} MB`,
      external: `${(memory.external / 1024 / 1024).toFixed(2)} MB`,
    },
    cpuUsage: process.cpuUsage(),
  };
}

module.exports = {
  performanceMiddleware,
  getPerformanceMetrics,
};