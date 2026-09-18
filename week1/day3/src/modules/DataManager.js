// src/modules/DataManager.js
export class DataManager {
  constructor(apiUrl) {
    this.apiUrl = apiUrl;
    this.cache = new Map();
    this.subscribers = new Set();
  }

  async fetchData(endpoint, options = {}) {
    const cacheKey = `${endpoint}-${JSON.stringify(options)}`;

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      // Since we don't have a real backend yet, we intercept the API calls
      // and return Mock Data so the charts can render successfully!
      const data = await this.getMockData(endpoint);
      
      this.cache.set(cacheKey, data);
      this.notifySubscribers(endpoint, data);

      return data;
    } catch (error) {
      console.error("Data fetch error:", error);
      throw error;
    }
  }

  async getMockData(endpoint) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (endpoint === '/api/users') {
          resolve({
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            values: [120, 150, 180, 140, 210, 250, 220]
          });
        } else if (endpoint === '/api/revenue') {
          resolve({
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            values: [1200, 1900, 1500, 2200, 2800, 3100, 2900]
          });
        } else if (endpoint === '/api/orders') {
          resolve({
            labels: ['Electronics', 'Clothing', 'Food', 'Books'],
            values: [300, 150, 400, 200]
          });
        } else {
          resolve({ labels: [], values: [] });
        }
      }, 400); // 400ms delay to simulate a real network request!
    });
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  notifySubscribers(endpoint, data) {
    this.subscribers.forEach((callback) => callback(endpoint, data));
  }

  clearCache() {
    this.cache.clear();
  }
}
