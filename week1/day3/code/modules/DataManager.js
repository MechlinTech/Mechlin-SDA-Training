export class DataManager {
    constructor(apiUrl) {
        this.apiUrl = apiUrl;
        this.cache = new Map();
        this.subscribers = new Set();
    }

    async fetchData(endpoint, options = {}) {
        const cacheKey = `${endpoint}${JSON.stringify(options)}`;

        // Return cached data if available
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        try {
            const response = await fetch(`${this.apiUrl}${endpoint}`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });

            if (!response.ok) {
                throw new Error(
                    `HTTP error! status: ${response.status}`
                );
            }

            const data = await response.json();

            this.cache.set(cacheKey, data);
            this.notifySubscribers(endpoint, data);

            return data;
        } catch (error) {
            console.warn(
                `API unavailable for ${endpoint}. Using local demo data.`
            );

            const data = this.getMockData(endpoint);

            this.cache.set(cacheKey, data);
            this.notifySubscribers(endpoint, data);

            return data;
        }
    }

    getMockData(endpoint) {
        const labels = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun'
        ];

        const variation = () =>
            Math.floor(Math.random() * 20);

        switch (endpoint) {
            case '/users':
                return {
                    labels,
                    values: [
                        120 + variation(),
                        180 + variation(),
                        240 + variation(),
                        310 + variation(),
                        390 + variation(),
                        470 + variation()
                    ]
                };

            case '/revenue':
                return {
                    labels,
                    values: [
                        15000 + variation() * 100,
                        22000 + variation() * 100,
                        28000 + variation() * 100,
                        35000 + variation() * 100,
                        43000 + variation() * 100,
                        52000 + variation() * 100
                    ]
                };

            case '/orders':
                return {
                    labels: [
                        'Completed',
                        'Pending',
                        'Cancelled',
                        'Returned'
                    ],
                    values: [
                        120 + variation(),
                        45 + variation(),
                        18 + variation(),
                        12 + variation()
                    ]
                };

            default:
                throw new Error(
                    `No mock data available for ${endpoint}`
                );
        }
    }

    subscribe(callback) {
        this.subscribers.add(callback);

        return () => {
            this.subscribers.delete(callback);
        };
    }

    notifySubscribers(endpoint, data) {
        this.subscribers.forEach(callback => {
            try {
                callback(endpoint, data);
            } catch (error) {
                console.error(
                    'Subscriber error:',
                    error
                );
            }
        });
    }

    clearCache() {
        this.cache.clear();
    }
}