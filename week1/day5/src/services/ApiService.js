

class ApiService {
    constructor(baseURL, options = {}) {
        this.baseURL = baseURL;
        this.cache = new Map(); // A dictionary to store cached responses
        this.retryAttempts = options.retryAttempts || 3; // How many times to try before giving up
        this.retryDelay = options.retryDelay || 1000; // How long to wait before first retry (milliseconds)
        this.timeout = options.timeout || 10000; // Request abort timeout
        this.subscribers = new Set(); // For components wanting to listen to global API events
    }

    // The core request method all other Methods (GET, POST etc) use
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        // A unique string for caching based on URL and request options
        const cacheKey = `${url}-${JSON.stringify(options)}`;

        // 1. CACHE CHECK: If we already have the data and it's fresh, return it immediately
        if (options.cache !== false && this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            const cacheTimeLimit = options.cacheTTL || 300000; // default 5 minutes
            if (Date.now() - cached.timestamp < cacheTimeLimit) {
                console.log(`[API Cache Hit] ${endpoint}`);
                return cached.data;
            }
        }

        // 2. PREPARE REQUEST
        const config = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers // Merge custom headers
            },
            timeout: this.timeout,
            ...options
        };

        // 3. EXECUTE REQUEST
        try {
            // We use our custom fetchWithRetry method instead of raw fetch
            const response = await this.fetchWithRetry(url, config);
            const data = await response.json();

            // 4. SAVE TO CACHE (if allowed)
            if (options.cache !== false) {
                this.cache.set(cacheKey, {
                    data,
                    timestamp: Date.now() // Record WHEN we saved it so we know when it expires
                });
            }

            return data;
        } catch (error) {
            console.error('API request failed:', error);
            throw error; // Re-throw the error so the UI can catch it and show an alert
        }
    }

    // Advanced fetch that knows how to abort if taking too long, and how to retry on failure
    async fetchWithRetry(url, config, attempt = 1) {
        try {
            // AbortController lets us cancel a fetch request if it hangs
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.timeout);

            const response = await fetch(url, {
                ...config,
                signal: controller.signal // Link the abort signal to the fetch
            });

            clearTimeout(timeoutId); // Request succeeded, clear the timeout

            // Fetch does not throw an error on 404 or 500, we have to check response.ok Manually
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return response;
        } catch (error) {
            // If we haven't reached the max attempts, and the error warrants a retry
            if (attempt < this.retryAttempts && this.shouldRetry(error)) {
                // Exponential Backoff: Wait 1s, then 2s, then 4s...
                const backoffTime = this.retryDelay * Math.pow(2, attempt - 1);
                console.warn(`[API Retry] Attempt ${attempt} failed. Retrying in ${backoffTime}ms...`);
                await this.delay(backoffTime);
                return this.fetchWithRetry(url, config, attempt + 1); // Recursive call
            }
            throw error; // All retry attempts burned, throw the final error
        }
    }

    // Helper to decide IF we should retry based on the error type
    shouldRetry(error) {
        return error.name === 'AbortError' || // Timeout happened
            error.message.includes('500') || // Server crashed
            error.message.includes('502') || // Bad gateway
            error.message.includes('503');   // Service unavailable
    }

    // Simple promise wrapper around setTimeout to make waiting async
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // --- CRUD (Create, Read, Update, Delete) Convenience Methods ---

    async get(endpoint, options = {}) {
        return this.request(endpoint, { ...options, method: 'GET' });
    }

    async post(endpoint, data, options = {}) {
        return this.request(endpoint, {
            ...options,
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async put(endpoint, data, options = {}) {
        return this.request(endpoint, {
            ...options,
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    async delete(endpoint, options = {}) {
        return this.request(endpoint, { ...options, method: 'DELETE' });
    }

    // --- Cache Management ---
    clearCache() {
        this.cache.clear();
    }

    getCacheSize() {
        return this.cache.size;
    }

    // --- Global Event Subscribers (Pub/Sub pattern) ---
    subscribe(callback) {
        this.subscribers.add(callback);
        // Return an unsubscribe function
        return () => this.subscribers.delete(callback);
    }

    notifySubscribers(event, data) {
        this.subscribers.forEach(callback => callback(event, data));
    }
}

export default ApiService;
