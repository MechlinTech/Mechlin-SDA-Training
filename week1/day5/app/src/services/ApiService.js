class ApiService {
  constructor(baseURL, options = {}) {
    this.baseURL = baseURL;
    this.cache = new Map();
    this.retryAttempts = options.retryAttempts || 3;
    this.retryDelay = options.retryDelay || 1000;
    this.timeout = options.timeout || 10000;
    this.subscribers = new Set();
  }

  async request(endpoint, options = {}) {
    const {
      method = "GET",
      body,
      headers = {},
      cache = true,
      cacheTTL = 300000,
    } = options;

    const url = `${this.baseURL}${endpoint}`;
    const cacheKey = `${method}:${url}:${JSON.stringify(body || {})}`;

    // Return cached response if available
    if (cache) {
      const cached = this.cache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < cacheTTL) {
        return cached.data;
      }
    }

    const config = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      signal: undefined,
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    try {
      const response = await this.fetchWithRetry(url, config);

      if (!response.ok) {
        throw new Error(
          `HTTP Error: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      if (cache) {
        this.cache.set(cacheKey, {
          data,
          timestamp: Date.now(),
        });
      }

      this.notifySubscribers({
        type: "request",
        endpoint,
        method,
        data,
      });

      return data;
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  async fetchWithRetry(url, config, attempt = 0) {
    const controller = new AbortController();

    const timeoutId = setTimeout(() => {
      controller.abort();
    }, this.timeout);

    try {
      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (this.shouldRetry(response.status) && attempt < this.retryAttempts) {
          const delay = this.retryDelay * Math.pow(2, attempt);

          await this.sleep(delay);

          return this.fetchWithRetry(url, config, attempt + 1);
        }
      }

      return response;
    } catch (error) {
      clearTimeout(timeoutId);

      if (attempt < this.retryAttempts && this.shouldRetry(error)) {
        const delay = this.retryDelay * Math.pow(2, attempt);

        await this.sleep(delay);

        return this.fetchWithRetry(url, config, attempt + 1);
      }

      throw error;
    }
  }

  shouldRetry(error) {
    if (error instanceof Error) {
      return error.name === "AbortError";
    }

    return [500, 502, 503].includes(error);
  }

  sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  async get(endpoint, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: "GET",
    });
  }

  async post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: "POST",
      body: data,
      cache: false,
    });
  }

  async put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: "PUT",
      body: data,
      cache: false,
    });
  }

  async delete(endpoint, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: "DELETE",
      cache: false,
    });
  }

  clearCache() {
    this.cache.clear();
  }

  getCacheSize() {
    return this.cache.size;
  }

  subscribe(callback) {
    this.subscribers.add(callback);

    return () => {
      this.subscribers.delete(callback);
    };
  }

  notifySubscribers(event) {
    this.subscribers.forEach((callback) => {
      try {
        callback(event);
      } catch (error) {
        console.error("Subscriber error:", error);
      }
    });
  }
}

export default ApiService;