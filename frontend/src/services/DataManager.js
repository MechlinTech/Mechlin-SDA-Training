/**
 * ============================================================
 * DataManager (Day 5 Enhanced)
 * ------------------------------------------------------------
 * Responsibilities:
 * 1. Fetch API data
 * 2. Cache responses with TTL
 * 3. Retry failed requests
 * 4. Abort long-running requests
 * 5. CRUD operations
 * 6. Notify subscribers
 * ============================================================
 */

export class DataManager {
  constructor(apiUrl, options = {}) {
    this.apiUrl = apiUrl;

    this.cache = new Map();
    this.subscribers = new Set();

    this.timeout = options.timeout || 10000;
    this.retryAttempts = options.retryAttempts || 3;
    this.retryDelay = options.retryDelay || 1000;
    this.cacheTTL = options.cacheTTL || 5 * 60 * 1000;
  }

  getCacheKey(endpoint, options = {}) {
    return `${endpoint}-${JSON.stringify(options)}`;
  }

  getCachedData(cacheKey) {
    const cached = this.cache.get(cacheKey);

    if (!cached) return null;

    const expired =
      Date.now() - cached.timestamp > this.cacheTTL;

    if (expired) {
      this.cache.delete(cacheKey);
      return null;
    }

    return cached.data;
  }

  saveCache(cacheKey, data) {
    this.cache.set(cacheKey, {
      data,
      timestamp: Date.now(),
    });
  }

  async fetchWithRetry(url, options, attempt = 1) {
    const controller = new AbortController();

    const timeoutId = setTimeout(() => {
      controller.abort();
    }, this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}`);
      }

      return response;
    } catch (error) {
      clearTimeout(timeoutId);

      const shouldRetry =
        error.name === "AbortError" ||
        error.message.includes("500") ||
        error.message.includes("502") ||
        error.message.includes("503");

      if (
        shouldRetry &&
        attempt < this.retryAttempts
      ) {
        console.warn(
          `Retry ${attempt}/${this.retryAttempts}`
        );

        await this.delay(
          this.retryDelay * Math.pow(2, attempt - 1)
        );

        return this.fetchWithRetry(
          url,
          options,
          attempt + 1
        );
      }

      throw error;
    }
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async request(endpoint, options = {}) {
    const cacheKey = this.getCacheKey(endpoint, options);

    const useCache =
      !options.method || options.method === "GET";

    if (useCache) {
      const cached = this.getCachedData(cacheKey);

      if (cached) {
        console.log("✅ Cache Hit");
        return cached;
      }
    }

    try {
      const response = await this.fetchWithRetry(
        `${this.apiUrl}${endpoint}`,
        {
          headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
          },
          ...options,
        }
      );

      const data = await response.json();

      if (useCache) {
        this.saveCache(cacheKey, data);
      }

      this.notifySubscribers(endpoint, data);

      return data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }
  async fetchData(endpoint, options = {}) {
    return this.request(endpoint, options);
  }

  // --------------------
  // CRUD METHODS
  // --------------------

  get(endpoint) {
    return this.request(endpoint);
  }

  post(endpoint, body) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  put(endpoint, body) {
    return this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  }

  patch(endpoint, body) {
    return this.request(endpoint, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
  }

  delete(endpoint) {
    return this.request(endpoint, {
      method: "DELETE",
    });
  }

  subscribe(callback) {
    this.subscribers.add(callback);

    return () => {
      this.subscribers.delete(callback);
    };
  }

  notifySubscribers(endpoint, data) {
    this.subscribers.forEach((callback) => {
      callback(endpoint, data);
    });
  }

  clearCache() {
    this.cache.clear();
    console.log("🗑 Cache Cleared");
  }

  getCacheSize() {
    return this.cache.size;
  }
}