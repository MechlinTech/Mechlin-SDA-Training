export class PerformanceMonitor {
    constructor() {
        this.metrics = new Map();
        this.observers = new Set();
        this.init();
    }

    init() {
        this.observePerformance();
        this.observeMemory();
        this.observeUserInteractions();
    }

    observePerformance() {
        if (!('PerformanceObserver' in window)) return;

        try {
            const recordIfValid = (name) => (list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                if (lastEntry) this.recordMetric(name, lastEntry.startTime || lastEntry.processingStart || lastEntry.value);
            };

            // LCP
            new PerformanceObserver(recordIfValid('LCP')).observe({ entryTypes: ['largest-contentful-paint'] });

            // FID
            new PerformanceObserver((list) => {
                list.getEntries().forEach(entry => this.recordMetric('FID', entry.processingStart - entry.startTime));
            }).observe({ entryTypes: ['first-input'] });

            // CLS
            new PerformanceObserver((list) => {
                list.getEntries().forEach(entry => {
                    if (!entry.hadRecentInput) this.recordMetric('CLS', entry.value);
                });
            }).observe({ entryTypes: ['layout-shift'] });
        } catch (e) {
            console.warn('Performance APIs not fully supported or restricted.', e);
        }
    }

    observeMemory() {
        if ('memory' in performance) {
            setInterval(() => {
                const memory = performance.memory;
                this.recordMetric('memory-used', memory.usedJSHeapSize);
            }, 5000); // Polling every 5s
        }
    }

    observeUserInteractions() {
        let interactionCount = 0;

        // Passive listeners prevent scroll blocking on mobile
        ['click', 'keydown', 'scroll', 'touchstart'].forEach(eventType => {
            document.addEventListener(eventType, () => {
                interactionCount++;
                this.recordMetric('interaction-count', interactionCount);
            }, { passive: true });
        });
    }

    recordMetric(name, value) {
        const metric = { name, value, timestamp: Date.now() };
        this.metrics.set(name, metric);
        this.notifyObservers(metric);
        this.storeMetric(metric);
    }

    subscribe(callback) {
        this.observers.add(callback);
        return () => this.observers.delete(callback);
    }

    notifyObservers(metric) {
        this.observers.forEach(callback => callback(metric));
    }

    storeMetric(metric) {
        try {
            const stored = JSON.parse(localStorage.getItem('performance-metrics') || '[]');
            stored.push(metric);

            // Cap to last 100 entries to spare quota
            if (stored.length > 100) {
                stored.splice(0, stored.length - 100);
            }

            localStorage.setItem('performance-metrics', JSON.stringify(stored));
        } catch (e) {
            console.warn('Storage quota exceeded or unavailable. Cannot store metrics locally.');
        }
    }

    getStoredMetrics() {
        try {
            return JSON.parse(localStorage.getItem('performance-metrics') || '[]');
        } catch {
            return [];
        }
    }
}
