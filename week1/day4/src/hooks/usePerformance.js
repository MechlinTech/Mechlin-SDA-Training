import { useState, useEffect } from 'react';

export function usePerformance() {
    const [metrics, setMetrics] = useState({});

    useEffect(() => {
        const updateMetrics = () => {
            if ('performance' in window) {
                const navigation = performance.getEntriesByType('navigation')[0];
                const paint = performance.getEntriesByType('paint');

                if (navigation) {
                    setMetrics({
                        loadTime: navigation.loadEventEnd - navigation.loadEventStart,
                        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
                        firstPaint: paint.find(entry => entry.name === 'first-paint')?.startTime,
                        firstContentfulPaint: paint.find(entry => entry.name === 'first-contentful-paint')?.startTime
                    });
                }
            }
        };

        updateMetrics();

        const interval = setInterval(updateMetrics, 5000);
        return () => clearInterval(interval);
    }, []);

    return metrics;
}
