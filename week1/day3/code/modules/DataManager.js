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

        // Sample data for Day 3 demonstration
        const sampleData = {
            '/api/users': {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                values: [120, 180, 250, 320, 410, 520]
            },

            '/api/revenue': {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                values: [12000, 18000, 24000, 31000, 39000, 47000]
            },

            '/api/orders': {
                labels: ['Completed', 'Pending', 'Cancelled', 'Returned'],
                values: [450, 120, 50, 30]
            }
        };

        try {
            await new Promise(resolve => setTimeout(resolve, 500));

            const data = sampleData[endpoint];

            if (!data) {
                throw new Error(`No sample data found for ${endpoint}`);
            }

            this.cache.set(cacheKey, data);
            this.notifySubscribers(endpoint, data);

            return data;

        } catch (error) {
            console.error('Data fetch error:', error);
            throw error;
        }
    }

    subscribe(callback) {
        this.subscribers.add(callback);

        return () => this.subscribers.delete(callback);
    }

    notifySubscribers(endpoint, data) {
        this.subscribers.forEach(callback => {
            callback(endpoint, data);
        });
    }

    clearCache() {
        this.cache.clear();
    }
}