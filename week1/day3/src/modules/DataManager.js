export class DataManager {
    constructor(apiUrl, cacheTTL = 5 * 60 * 1000) { // Default 5 mins TTL
        this.apiUrl = apiUrl;
        this.cache = new Map();
        this.subscribers = new Set();
        this.activeRequests = new Map(); // Track ongoing requests to allow cancellation
        this.cacheTTL = cacheTTL;
    }
    
    async fetchData(endpoint, options = {}) {
        const cacheKey = `${endpoint}-${JSON.stringify(options)}`;
        
        // 1. Check valid cache
        if (this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.cacheTTL) {
                return cached.data;
            }
            this.cache.delete(cacheKey); // Evict stale cache
        }
        
        // 2. Cancel duplicate in-flight requests
        if (this.activeRequests.has(cacheKey)) {
            this.activeRequests.get(cacheKey).abort();
        }
        
        const controller = new AbortController();
        this.activeRequests.set(cacheKey, controller);
        
        try {
            // For demo purposes, we will mock API responses when fetching from /api/...
            if (this.apiUrl === '/api') {
                return await this.mockNetworkResponse(endpoint);
            }

            const response = await fetch(`${this.apiUrl}${endpoint}`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                signal: controller.signal,
                ...options
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // 3. Cache the result with a timestamp
            this.cache.set(cacheKey, { timestamp: Date.now(), data });
            
            this.notifySubscribers(endpoint, data);
            return data;
        } catch (error) {
            if (error.name === 'AbortError') {
                console.log(`Fetch aborted for ${endpoint}`);
                return null;
            }
            console.error('Data fetch error:', error);
            throw error;
        } finally {
            this.activeRequests.delete(cacheKey);
        }
    }

    async mockNetworkResponse(endpoint) {
        // Simulating network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        let data;
        if (endpoint === '/users') {
            data = { labels: ['Jan', 'Feb', 'Mar', 'Apr'], values: [120, 150, 200, 240] };
        } else if (endpoint === '/revenue') {
            data = { labels: ['Jan', 'Feb', 'Mar', 'Apr'], values: [5000, 7000, 6000, 9000] };
        } else if (endpoint === '/orders') {
            data = { labels: ['Electronics', 'Clothing', 'Food', 'Books'], values: [40, 30, 20, 10] };
        }

        const cacheKey = `${endpoint}-{}`;
        this.cache.set(cacheKey, { timestamp: Date.now(), data });
        this.notifySubscribers(endpoint, data);
        return data;
    }
    
    subscribe(callback) {
        this.subscribers.add(callback);
        // Return an unsubscribe function
        return () => this.subscribers.delete(callback);
    }
    
    notifySubscribers(endpoint, data) {
        this.subscribers.forEach(callback => callback(endpoint, data));
    }
    
    clearCache() {
        this.cache.clear();
    }
}
