const redis = require("redis");
const { logger } = require("./errorHandler");

class CacheService {
  constructor() {
    this.client = null;
    this.isConnected = false;
  }

  async connect() {
    try {
      this.client = redis.createClient({
        url: process.env.REDIS_URL || "redis://localhost:6379",
      });

      this.client.on("connect", () => {
        this.isConnected = true;
        logger.info("Redis connected successfully");
      });

      this.client.on("error", (err) => {
        this.isConnected = false;
        logger.error("Redis connection error:", err);
      });

      await this.client.connect();
    } catch (error) {
      logger.error("Redis connection failed:", error);
      throw error;
    }
  }

  async get(key) {
    try {
      if (!this.isConnected) return null;

      const value = await this.client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      logger.error("Redis get error:", error);
      return null;
    }
  }

  async set(key, value, ttl = 3600) {
    try {
      if (!this.isConnected) return false;

      await this.client.setEx(key, ttl, JSON.stringify(value));
      return true;
    } catch (error) {
      logger.error("Redis set error:", error);
      return false;
    }
  }

  async del(key) {
    try {
      if (!this.isConnected) return false;

      await this.client.del(key);
      return true;
    } catch (error) {
      logger.error("Redis delete error:", error);
      return false;
    }
  }

  async flush() {
    try {
      if (!this.isConnected) return false;

      await this.client.flushAll();
      return true;
    } catch (error) {
      logger.error("Redis flush error:", error);
      return false;
    }
  }

  generateKey(prefix, params = {}) {
    const sortedParams = Object.keys(params)
      .sort()
      .map((key) => `${key}:${params[key]}`)
      .join("|");

    return `${prefix}:${sortedParams}`;
  }
}

const cacheService = new CacheService();

const cache = (ttl = 3600, keyGenerator = null) => {
  return async (req, res, next) => {
    try {
      const cacheKey = keyGenerator
        ? keyGenerator(req)
        : cacheService.generateKey(req.path, req.query);

      const cachedData = await cacheService.get(cacheKey);

      if (cachedData) {
        res.set("X-Cache", "HIT");
        return res.json(cachedData);
      }

      const originalJson = res.json;

      res.json = function (data) {
        cacheService.set(cacheKey, data, ttl);
        res.set("X-Cache", "MISS");
        return originalJson.call(this, data);
      };

      next();
    } catch (error) {
      logger.error("Cache middleware error:", error);
      next();
    }
  };
};

module.exports = {
  cacheService,
  cache,
};