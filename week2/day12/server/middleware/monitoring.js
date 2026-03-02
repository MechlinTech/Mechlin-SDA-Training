// middleware/monitoring.js
const winston = require('winston');
const { performance } = require('perf_hooks');

// Configure logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'sda-training-api' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

class MonitoringService {
  constructor() {
    this.metrics = new Map();
    this.startTime = Date.now();
  }

  recordRequest(req, res, duration) {
    const metric = {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration,
      timestamp: new Date().toISOString(),
      userAgent: req.get('User-Agent'),
      ip: req.ip,
      userId: req.user?.userId
    };

    logger.info('Request processed', metric);
    this.updateMetrics(metric);
  }

  recordError(error, req) {
    const errorMetric = {
      error: error.message,
      stack: error.stack,
      url: req.url,
      method: req.method,
      timestamp: new Date().toISOString(),
      userId: req.user?.userId
    };

    logger.error('Request error', errorMetric);
  }

  updateMetrics(metric) {
    const key = `${metric.method}:${metric.url}`;
    if (!this.metrics.has(key)) {
      this.metrics.set(key, {
        count: 0,
        totalDuration: 0,
        errors: 0,
        lastRequest: null
      });
    }

    const stats = this.metrics.get(key);
    stats.count++;
    stats.totalDuration += metric.duration;
    stats.lastRequest = metric.timestamp;

    if (metric.statusCode >= 400) {
      stats.errors++;
    }
  }

  getMetrics() {
    const uptime = Date.now() - this.startTime;
    const memoryUsage = process.memoryUsage();

    return {
      uptime,
      memory: {
        rss: memoryUsage.rss,
        heapTotal: memoryUsage.heapTotal,
        heapUsed: memoryUsage.heapUsed,
        external: memoryUsage.external
      },
      requestMetrics: Object.fromEntries(this.metrics),
      process: {
        pid: process.pid,
        version: process.version,
        platform: process.platform,
        arch: process.arch
      }
    };
  }

  getHealthStatus() {
    const metrics = this.getMetrics();
    const memoryUsagePercent = (metrics.memory.heapUsed / metrics.memory.heapTotal) * 100;

    return {
      status: memoryUsagePercent > 90 ? 'unhealthy' : 'healthy',
      uptime: metrics.uptime,
      memoryUsage: memoryUsagePercent,
      requestCount: Array.from(this.metrics.values()).reduce((sum, stat) => sum + stat.count, 0),
      errorRate: this.calculateErrorRate()
    };
  }

  calculateErrorRate() {
    const totalRequests = Array.from(this.metrics.values()).reduce((sum, stat) => sum + stat.count, 0);
    const totalErrors = Array.from(this.metrics.values()).reduce((sum, stat) => sum + stat.errors, 0);
    
    return totalRequests > 0 ? (totalErrors / totalRequests) * 100 : 0;
  }
}

const monitoringService = new MonitoringService();

// Monitoring middleware
const monitoringMiddleware = (req, res, next) => {
  const start = performance.now();

  res.on('finish', () => {
    const duration = performance.now() - start;
    monitoringService.recordRequest(req, res, duration);
  });

  res.on('error', (error) => {
    monitoringService.recordError(error, req);
  });

  next();
};

// Health check endpoint
const healthCheck = (req, res) => {
  const health = monitoringService.getHealthStatus();
  res.json(health);
};

// Metrics endpoint
const metrics = (req, res) => {
  const metrics = monitoringService.getMetrics();
  res.json(metrics);
};

module.exports = {
  monitoringService,
  monitoringMiddleware,
  healthCheck,
  metrics,
  logger
};