const performanceMetrics = {
  totalRequests: 0,
  totalResponseTime: 0,
  averageResponseTime: 0,
};

const performanceMiddleware = (req, res, next) => {
  const startTime = process.hrtime();

  performanceMetrics.totalRequests++;

  res.on("finish", () => {
    const [seconds, nanoseconds] = process.hrtime(startTime);
    const responseTime = seconds * 1000 + nanoseconds / 1e6;

    performanceMetrics.totalResponseTime += responseTime;

    performanceMetrics.averageResponseTime =
      performanceMetrics.totalResponseTime /
      performanceMetrics.totalRequests;

    console.log(
      `${req.method} ${req.originalUrl} - ${responseTime.toFixed(
        2
      )}ms`
    );
  });

  next();
};

const getPerformanceMetrics = () => {
  return {
    ...performanceMetrics,
    averageResponseTime:
      Number(performanceMetrics.averageResponseTime.toFixed(2)),
  };
};

module.exports = {
  performanceMiddleware,
  getPerformanceMetrics,
};