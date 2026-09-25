import { useMemo } from 'react';
import { usePerformance } from '../hooks/usePerformance';

export function PerformanceMonitor() {
  const { metrics } = usePerformance();

  const recentMetrics = useMemo(() => {
    return metrics?.slice(-5).reverse() ?? [];
  }, [metrics]);

  return (
    <section className="performance-monitor">
      <div className="performance-header">
        <div>
          <h2>Performance Monitor</h2>
          <p>Recent application performance metrics</p>
        </div>

        <span className="performance-status">
          Monitoring
        </span>
      </div>

      {recentMetrics.length === 0 ? (
        <p className="performance-empty">
          Collecting performance metrics...
        </p>
      ) : (
        <div className="performance-metrics">
          {recentMetrics.map((metric, index) => (
            <div
              className="performance-metric"
              key={`${metric.name}-${metric.timestamp}-${index}`}
            >
              <strong>{metric.name}</strong>
              <span>{metric.value}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}