import { API_CONFIG } from "../config/api";

class ApiService {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.cache = new Map();
    this.token = localStorage.getItem("authToken");
  }

  getCacheKey(endpoint, options = {}) {
    return `${endpoint}-${JSON.stringify(options)}`;
  }

  getCachedData(cacheKey) {
    const cached = this.cache.get(cacheKey);

    if (!cached) return null;

    const isExpired =
      Date.now() - cached.timestamp > API_CONFIG.CACHE_TTL;

    if (isExpired) {
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

  async fetchWithRetry(url, options, retries = API_CONFIG.RETRY_ATTEMPTS) {
    let attempt = 0;

    while (attempt < retries) {
      const controller = new AbortController();

      const timeout = setTimeout(() => {
        controller.abort();
      }, API_CONFIG.TIMEOUT);

      try {
        const response = await fetch(url, {
          ...options,
          signal: controller.signal,
        });

        clearTimeout(timeout);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        return response;
      } catch (error) {
        clearTimeout(timeout);

        attempt++;

        if (attempt >= retries) {
          throw error;
        }

        await new Promise((resolve) =>
          setTimeout(
            resolve,
            API_CONFIG.RETRY_DELAY * Math.pow(2, attempt)
          )
        );
      }
    }
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    const cacheKey = this.getCacheKey(endpoint, options);

    if (
      options.method === undefined ||
      options.method === "GET"
    ) {
      const cached = this.getCachedData(cacheKey);

      if (cached) {
        return cached;
      }
    }

    const response = await this.fetchWithRetry(url, {
      headers: {
        "Content-Type": "application/json",
        ...(this.token && {
          Authorization: `Bearer ${this.token}`,
        }),
        ...(options.headers || {}),
      },
      ...options,
    });

    const data = await response.json();

    if (
      options.method === undefined ||
      options.method === "GET"
    ) {
      this.saveCache(cacheKey, data);
    }

    return data;
  }

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
  async login(credentials) {
    const response = await this.post("/auth/login", credentials);
  
    if (response?.data?.accessToken) {
      this.token = response.data.accessToken;
      localStorage.setItem("authToken", this.token);
    }
  
    return response;
  }
  
  logout() {
    this.token = null;
    localStorage.removeItem("authToken");
  }

  clearCache() {
    this.cache.clear();
  }

  getCacheSize() {
    return this.cache.size;
  }
}

const apiService = new ApiService();

export default apiService;