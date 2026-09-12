class ApiService {
    constructor(baseURL = '', options = {}) {
        this.baseURL = baseURL;
        this.cache = new Map();

        this.retryAttempts = options.retryAttempts || 3;
        this.retryDelay = options.retryDelay || 1000;
        this.timeout = options.timeout || 10000;

        this.subscribers = new Set();

        // Mock data for Day 5 demonstration
        this.mockData = {
            '/api/revenue': {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                values: [12000, 18000, 24000, 31000, 39000, 47000]
            },

            '/api/users': {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                values: [120, 180, 250, 320, 410, 520]
            },

            '/api/orders': {
                labels: [
                    'Completed',
                    'Pending',
                    'Cancelled',
                    'Returned'
                ],
                values: [450, 120, 50, 30]
            }
        };
    }

    // Main API request method
    async request(endpoint, options = {}) {
        const {
            cache = true,
            cacheTTL = 5 * 60 * 1000,
            ...fetchOptions
        } = options;

        // Check cache
        if (cache && this.cache.has(endpoint)) {
            const cached = this.cache.get(endpoint);

            if (Date.now() - cached.timestamp < cacheTTL) {
                return cached.data;
            }

            this.cache.delete(endpoint);
        }

        // Use mock data for our Day 5 dashboard
        if (this.mockData[endpoint]) {
            await new Promise((resolve) =>
                setTimeout(resolve, 500)
            );

            const data = this.mockData[endpoint];

            this.cache.set(endpoint, {
                data,
                timestamp: Date.now()
            });

            this.notifySubscribers(endpoint, data);

            return data;
        }

        // Real API request
        const url = `${this.baseURL}${endpoint}`;

        const data = await this.fetchWithRetry(
            url,
            fetchOptions
        );

        // Save successful response in cache
        if (cache) {
            this.cache.set(endpoint, {
                data,
                timestamp: Date.now()
            });
        }

        // Notify subscribers
        this.notifySubscribers(endpoint, data);

        return data;
    }

    // Fetch with retry and timeout
    async fetchWithRetry(url, options = {}) {
        let lastError;

        for (
            let attempt = 1;
            attempt <= this.retryAttempts;
            attempt++
        ) {
            const controller = new AbortController();

            const timeoutId = setTimeout(() => {
                controller.abort();
            }, this.timeout);

            try {
                const response = await fetch(url, {
                    ...options,
                    signal: controller.signal,
                    headers: {
                        'Content-Type': 'application/json',
                        ...(options.headers || {})
                    }
                });

                clearTimeout(timeoutId);

                if (!response.ok) {
                    const error = new Error(
                        `HTTP Error: ${response.status}`
                    );

                    error.status = response.status;

                    // Retry temporary/server errors
                    if (
                        response.status === 429 ||
                        response.status === 500 ||
                        response.status === 502 ||
                        response.status === 503
                    ) {
                        throw error;
                    }

                    throw error;
                }

                return await response.json();
            } catch (error) {
                clearTimeout(timeoutId);

                lastError = error;

                const shouldRetry =
                    error.name === 'AbortError' ||
                    error.status === 429 ||
                    error.status === 500 ||
                    error.status === 502 ||
                    error.status === 503;

                if (
                    !shouldRetry ||
                    attempt === this.retryAttempts
                ) {
                    throw error;
                }

                const delay =
                    this.retryDelay *
                    Math.pow(2, attempt - 1);

                await new Promise((resolve) =>
                    setTimeout(resolve, delay)
                );
            }
        }

        throw lastError;
    }

    // GET request
    async get(endpoint, options = {}) {
        return this.request(endpoint, {
            method: 'GET',
            ...options
        });
    }

    // POST request
    async post(endpoint, body, options = {}) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(body),
            ...options
        });
    }

    // PUT request
    async put(endpoint, body, options = {}) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(body),
            ...options
        });
    }

    // DELETE request
    async delete(endpoint, options = {}) {
        return this.request(endpoint, {
            method: 'DELETE',
            ...options
        });
    }

    // Clear all cached data
    clearCache() {
        this.cache.clear();
    }

    // Get cache size
    getCacheSize() {
        return this.cache.size;
    }

    // Subscribe to data updates
    subscribe(callback) {
        this.subscribers.add(callback);

        return () => {
            this.subscribers.delete(callback);
        };
    }

    // Notify all subscribers
    notifySubscribers(endpoint, data) {
        this.subscribers.forEach((callback) => {
            try {
                callback({
                    endpoint,
                    data,
                    timestamp: Date.now()
                });
            } catch (error) {
                console.error(
                    'Subscriber error:',
                    error
                );
            }
        });
    }
}

export default ApiService;