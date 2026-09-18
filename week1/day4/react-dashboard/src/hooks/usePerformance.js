import { useState, useEffect } from 'react';

export function usePerformance() {
  const [metrics, setMetrics] = useState({});

  useEffect(() => {
    const updateMetrics = () => {
      if ('performance' in window) {
        const memory = performance.memory ? performance.memory.usedJSHeapSize / 1048576 : 0;
        setMetrics({
          memory: memory.toFixed(2),
          timestamp: Date.now()
        });
      }
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 5000);
    return () => clearInterval(interval);
  }, []);

  return metrics;
}
