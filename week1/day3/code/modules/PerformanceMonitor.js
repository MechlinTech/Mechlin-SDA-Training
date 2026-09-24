export class PerformanceMonitor {
    constructor() {
        this.metrics = new Map();
        this.observers = new Set();
        this.performanceObservers = new Set();
        this.storageKey = 'day3-performance-metrics';

        this.loadStoredMetrics();
    }

    startMonitoring() {
        this.observeWebVitals();
        this.observeMemory();
        this.observeInteractions();
    }

    observeWebVitals() {
        if (!window.PerformanceObserver) {
            console.warn('PerformanceObserver is not supported.');
            return;
        }

        const supportedMetrics = [
            {
                name: 'LCP',
                type: 'largest-contentful-paint'
            },
            {
                name: 'FID',
                type: 'first-input'
            },
            {
                name: 'CLS',
                type: 'layout-shift'
            }
        ];

        supportedMetrics.forEach(({ name, type }) => {
            try {
                const observer = new PerformanceObserver(list => {
                    const entries = list.getEntries();

                    if (!entries.length) {
                        return;
                    }

                    const entry = entries[entries.length - 1];

                    let value;

                    if (name === 'CLS') {
                        value = entries.reduce(
                            (total, currentEntry) =>
                                total + (currentEntry.value || 0),
                            0
                        );
                    } else if (name === 'FID') {
                        value =
                            entry.processingStart -
                            entry.startTime;
                    } else {
                        value = entry.startTime || entry.value;
                    }

                    this.recordMetric(name, value);
                });

                observer.observe({
                    type,
                    buffered: true
                });

                this.performanceObservers.add(observer);
            } catch (error) {
                console.warn(
                    `Unable to observe ${name}:`,
                    error.message
                );
            }
        });
    }

    observeMemory() {
        if (!performance.memory) {
            console.warn(
                'Memory monitoring is not supported in this browser.'
            );
            return;
        }

        const collectMemory = () => {
            const memory = performance.memory;

            this.recordMetric('JSHeapSize', {
                used: memory.usedJSHeapSize,
                total: memory.totalJSHeapSize,
                limit: memory.jsHeapSizeLimit
            });
        };

        collectMemory();

        const memoryInterval = setInterval(
            collectMemory,
            5000
        );

        this.performanceObservers.add({
            disconnect: () => clearInterval(memoryInterval)
        });
    }

    observeInteractions() {
        const interactionTypes = [
            'click',
            'keydown',
            'scroll',
            'touchstart'
        ];

        interactionTypes.forEach(type => {
            const handler = () => {
                const metricName = `${type}Count`;
                const existingMetric =
                    this.metrics.get(metricName);

                let currentCount = 0;

                if (
                    existingMetric &&
                    typeof existingMetric.value === 'number'
                ) {
                    currentCount = existingMetric.value;
                }

                this.recordMetric(
                    metricName,
                    currentCount + 1
                );
            };

            document.addEventListener(type, handler, {
                passive: true
            });

            this.performanceObservers.add({
                disconnect: () => {
                    document.removeEventListener(
                        type,
                        handler
                    );
                }
            });
        });
    }

    recordMetric(name, value) {
        const metric = {
            value,
            timestamp: Date.now()
        };

        this.metrics.set(name, metric);

        this.saveMetrics();
        this.notifyObservers(name, metric);
    }

    getMetric(name) {
        return this.metrics.get(name);
    }

    getAllMetrics() {
        return Object.fromEntries(this.metrics);
    }

    subscribe(callback) {
        this.observers.add(callback);

        return () => {
            this.observers.delete(callback);
        };
    }

    notifyObservers(name, metric) {
        this.observers.forEach(callback => {
            try {
                callback(name, metric);
            } catch (error) {
                console.error(
                    'Performance observer error:',
                    error
                );
            }
        });
    }

    saveMetrics() {
        try {
            const history = JSON.parse(
                localStorage.getItem(
                    this.storageKey
                ) || '[]'
            );

            history.push({
                metrics: this.getAllMetrics(),
                timestamp: Date.now()
            });

            const recentHistory =
                history.slice(-100);

            localStorage.setItem(
                this.storageKey,
                JSON.stringify(recentHistory)
            );
        } catch (error) {
            console.warn(
                'Unable to save performance metrics:',
                error
            );
        }
    }

    loadStoredMetrics() {
        try {
            const stored = JSON.parse(
                localStorage.getItem(
                    this.storageKey
                ) || '[]'
            );

            if (!stored.length) {
                return;
            }

            const latest =
                stored[stored.length - 1];

            if (!latest.metrics) {
                return;
            }

            Object.entries(
                latest.metrics
            ).forEach(([name, metric]) => {
                /*
                 * Clean old corrupted interaction
                 * counter values created by the
                 * previous implementation.
                 */
                if (
                    name.endsWith('Count') &&
                    typeof metric.value !== 'number'
                ) {
                    this.metrics.set(name, {
                        value: 0,
                        timestamp: Date.now()
                    });

                    return;
                }

                this.metrics.set(name, metric);
            });
        } catch (error) {
            console.warn(
                'Unable to load stored performance metrics:',
                error
            );
        }
    }

    getPerformanceSummary() {
        return {
            metrics: this.getAllMetrics(),
            metricCount: this.metrics.size,
            timestamp: Date.now()
        };
    }

    stopMonitoring() {
        this.performanceObservers.forEach(
            observer => {
                if (
                    observer &&
                    typeof observer.disconnect ===
                        'function'
                ) {
                    observer.disconnect();
                }
            }
        );

        this.performanceObservers.clear();
    }
}