// =============================================================================
// File: caching.js
//
// Purpose:
// This middleware provides a caching layer for the application.
//
// Instead of fetching the same data from the database repeatedly,
// it stores frequently requested responses in Redis.
//
// Responsibilities:
// - Connect to Redis
// - Check whether cached data exists
// - Store API responses in cache
// - Delete cache when required
// - Generate unique cache keys
// - Continue running even if Redis is unavailable
//
// Importance:
// - Improves API performance
// - Reduces database load
// - Handles large traffic efficiently
// - Makes the application production-ready
// =============================================================================

const redis = require("redis");
const { logger } = require("./errorHandler");

class CacheService {
  constructor() {
    this.client = null;
    this.isConnected = false;
  }

  // --------------------------------------------------------------------------
  // Connect to Redis
  //
  // Tries only once to connect. If Redis is unavailable, the application
  // continues running without caching.
  // --------------------------------------------------------------------------

  async connect() {
    try {
      this.client = redis.createClient({
        url: process.env.REDIS_URL || "redis://localhost:6379",

        socket: {
          connectTimeout: 2000,

          // Disable endless reconnect attempts
          reconnectStrategy: () => false,
        },
      });

      this.client.on("connect", () => {
        this.isConnected = true;
        logger.info("✅ Redis connected successfully.");
      });

      this.client.on("end", () => {
        this.isConnected = false;
      });

      this.client.on("error", () => {
        this.isConnected = false;
      });

      await this.client.connect();
    } catch (error) {
      this.isConnected = false;

      logger.warn("⚠ Redis is not available.");
      logger.warn("⚠ Continuing without caching.");
    }
  }

  // --------------------------------------------------------------------------
  // Get Cached Data
  // --------------------------------------------------------------------------

  async get(key) {
    try {
      if (!this.isConnected || !this.client) return null;

      const data = await this.client.get(key);

      if (!data) return null;

      return JSON.parse(data);
    } catch (error) {
      logger.error("Redis GET Error", error);
      return null;
    }
  }

  // --------------------------------------------------------------------------
  // Store Data
  // --------------------------------------------------------------------------

  async set(key, value, ttl = 3600) {
    try {
      if (!this.isConnected || !this.client) return false;

      await this.client.setEx(
        key,
        ttl,
        JSON.stringify(value)
      );

      return true;
    } catch (error) {
      logger.error("Redis SET Error", error);
      return false;
    }
  }

  // --------------------------------------------------------------------------
  // Delete Cache
  // --------------------------------------------------------------------------

  async del(key) {
    try {
      if (!this.isConnected || !this.client) return false;

      await this.client.del(key);

      return true;
    } catch (error) {
      logger.error("Redis DELETE Error", error);
      return false;
    }
  }

  // --------------------------------------------------------------------------
  // Clear Entire Cache
  // --------------------------------------------------------------------------

  async flush() {
    try {
      if (!this.isConnected || !this.client) return false;

      await this.client.flushAll();

      return true;
    } catch (error) {
      logger.error("Redis FLUSH Error", error);
      return false;
    }
  }

  // --------------------------------------------------------------------------
  // Clear Cache By Pattern
  // --------------------------------------------------------------------------

  async invalidate(pattern) {
    try {
      if (!this.isConnected || !this.client) return false;

      const keys = await this.client.keys(`${pattern}*`);

      if (keys.length > 0) {
        await this.client.del(keys);

        logger.info(
          `🗑 Cleared ${keys.length} cache entries for "${pattern}"`
        );
      }

      return true;
    } catch (error) {
      logger.error("Redis INVALIDATE Error", error);
      return false;
    }
  }

  // --------------------------------------------------------------------------
  // Generate Cache Key
  // --------------------------------------------------------------------------

  generateKey(prefix, params = {}) {
    const query = Object.keys(params)
      .sort()
      .map((key) => `${key}:${params[key]}`)
      .join("|");

    return `${prefix}:${query}`;
  }
}

// --------------------------------------------------------------------------
// Create Singleton Instance
// --------------------------------------------------------------------------

const cacheService = new CacheService();

// --------------------------------------------------------------------------
// Cache Middleware
// --------------------------------------------------------------------------

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
      logger.error("Cache Middleware Error", error);
      next();
    }
  };
};

module.exports = {
  cacheService,
  cache,
};