import { useCallback, useEffect, useState } from 'react';

export function usePerformance() {
  const [metrics, setMetrics] = useState(() => {
    if (typeof window === 'undefined') {
      return [];
    }

    try {
      const storedMetrics = localStorage.getItem(
        'performance-metrics'
      );

      return storedMetrics ? JSON.parse(storedMetrics) : [];
    } catch {
      return [];
    }
  });

  const recordMetric = useCallback((name, value) => {
    const metric = {
      name,
      value,
      timestamp: Date.now()
    };

    setMetrics((currentMetrics) => {
      const updatedMetrics = [...currentMetrics, metric].slice(-100);

      try {
        localStorage.setItem(
          'performance-metrics',
          JSON.stringify(updatedMetrics)
        );
      } catch {
        // Ignore localStorage errors.
      }

      return updatedMetrics;
    });
  }, []);

  useEffect(() => {
    if (typeof PerformanceObserver === 'undefined') {
      return undefined;
    }

    const observers = [];

    try {
      const navigationObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          recordMetric(entry.name, Math.round(entry.duration));
        });
      });

      navigationObserver.observe({
        type: 'navigation',
        buffered: true
      });

      observers.push(navigationObserver);
    } catch {
      // Navigation observer is not supported.
    }

    try {
      const paintObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          recordMetric(entry.name, Math.round(entry.startTime));
        });
      });

      paintObserver.observe({
        type: 'paint',
        buffered: true
      });

      observers.push(paintObserver);
    } catch {
      // Paint observer is not supported.
    }

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [recordMetric]);

  const getMetric = useCallback(
    (name) => {
      return metrics.filter((metric) => metric.name === name);
    },
    [metrics]
  );

  return {
    metrics,
    recordMetric,
    getMetric
  };
}