/**
 * ============================================================
 * DataManager
 * ------------------------------------------------------------
 * Responsibilities:
 * 1. Fetch data from API
 * 2. Cache API responses
 * 3. Notify subscribed modules whenever data changes
 * 4. Clear cache when required
 * ============================================================
 */

export class DataManager {
    /**
     * Constructor
     * Runs automatically whenever we create:
     *
     * const dataManager = new DataManager("/api");
     */
    constructor(apiUrl) {

        // Base URL of our backend
        this.apiUrl = apiUrl;

        // Cache stores API responses
        // Key   -> endpoint
        // Value -> API response
        this.cache = new Map();

        // Stores callback functions
        // These callbacks are notified whenever new data arrives
        this.subscribers = new Set();
    }

    /**
     * Fetch data from server
     *
     * endpoint example:
     * "/users"
     * "/orders"
     * "/products"
     */
    async fetchData(endpoint, options = {}) {

        // Create a unique cache key
        const cacheKey = `${endpoint}-${JSON.stringify(options)}`;

        /**
         * STEP 1
         * If data already exists in cache,
         * return it immediately.
         */
        if (this.cache.has(cacheKey)) {
            console.log("✅ Returning Cached Data");
            return this.cache.get(cacheKey);
        }

        try {

            /**
             * STEP 2
             * Fetch data from API
             */
            const response = await fetch(`${this.apiUrl}${endpoint}`, {

                headers: {
                    "Content-Type": "application/json",
                    ...options.headers
                },

                ...options
            });

            /**
             * STEP 3
             * Check if request was successful
             */
            if (!response.ok) {
                throw new Error(`HTTP Error : ${response.status}`);
            }

            /**
             * STEP 4
             * Convert JSON into JavaScript Object
             */
            const data = await response.json();

            /**
             * STEP 5
             * Save response inside cache
             */
            this.cache.set(cacheKey, data);

            /**
             * STEP 6
             * Notify every subscribed module
             */
            this.notifySubscribers(endpoint, data);

            return data;

        } catch (error) {

            console.error("❌ Data Fetch Error :", error);

            throw error;
        }
    }

    /**
     * Register a callback
     *
     * Example:
     * ChartManager subscribes here
     */
    subscribe(callback) {

        this.subscribers.add(callback);

        /**
         * Return an unsubscribe function
         *
         * Example:
         * const unsubscribe = subscribe(...)
         *
         * unsubscribe();
         */
        return () => this.subscribers.delete(callback);
    }

    /**
     * Notify every subscriber
     * whenever fresh data is received.
     */
    notifySubscribers(endpoint, data) {

        this.subscribers.forEach(callback => {

            callback(endpoint, data);

        });
    }

    /**
     * Clear complete cache
     * Useful when user clicks Refresh
     */
    clearCache() {

        this.cache.clear();

        console.log("🗑 Cache Cleared");

    }
}