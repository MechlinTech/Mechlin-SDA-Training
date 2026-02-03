import { useEffect, useState } from 'react';
import { PerformanceMonitor } from '../modules/PerformanceMonitor';

export function PerformancePanel() {
  const [metrics, setMetrics] = useState([]);

  useEffect(() => {
    const monitor = new PerformanceMonitor();

    const unsubscribe = monitor.subscribe((metric) => {
      setMetrics(prev => [...prev.slice(-9), metric]);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="performance-panel">
      <h3>Performance Metrics</h3>
      {metrics.map((m, i) => (
        <div key={i} className="metric-item">
          <strong>{m.name}</strong>: {m.value.toFixed(2)}
        </div>
      ))}
    </div>
  );
}
