/**
 * ============================================================
 * PerformanceMonitor
 * ------------------------------------------------------------
 * Responsibilities:
 * 1. Track browser performance metrics
 * 2. Monitor memory usage
 * 3. Record user interactions
 * 4. Notify subscribed components
 * ============================================================
 */

export class PerformanceMonitor {

    constructor() {

        // Stores latest metrics
        this.metrics = new Map();

        // Stores subscribed callbacks
        this.subscribers = new Set();

        // Start monitoring
        this.init();

    }

    /**
     * Initialize monitoring
     */
    init() {

        this.observeMemory();

        this.observeInteractions();

    }

    /**
     * Monitor JavaScript memory usage
     * (Works only in Chromium-based browsers)
     */
    observeMemory() {

        if (!performance.memory) return;

        setInterval(() => {

            this.recordMetric(
                "Used JS Heap",
                performance.memory.usedJSHeapSize
            );

        }, 5000);

    }

    /**
     * Count user interactions
     */
    observeInteractions() {

        let clicks = 0;

        document.addEventListener("click", () => {

            clicks++;

            this.recordMetric(
                "User Clicks",
                clicks
            );

        });

    }

    /**
     * Save metric and notify listeners
     */
    recordMetric(name, value) {

        const metric = {

            name,

            value,

            timestamp: Date.now()

        };

        this.metrics.set(name, metric);

        this.notifySubscribers(metric);

    }

    /**
     * Register listener
     */
    subscribe(callback) {

        this.subscribers.add(callback);

        return () => {

            this.subscribers.delete(callback);

        };

    }

    /**
     * Notify all listeners
     */
    notifySubscribers(metric) {

        this.subscribers.forEach(callback => {

            callback(metric);

        });

    }

    /**
     * Return one metric
     */
    getMetric(name) {

        return this.metrics.get(name);

    }

    /**
     * Return all metrics
     */
    getAllMetrics() {

        return [...this.metrics.values()];

    }

}