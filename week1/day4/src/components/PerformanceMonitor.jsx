import React from 'react';
import { usePerformance } from '../hooks/usePerformance';

export function PerformanceMonitor() {
    const metrics = usePerformance();

    return (
        <div className="performance-monitor" style={{ marginTop: '20px', padding: '15px', background: '#334155', borderRadius: '8px', fontSize: '0.9rem' }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#fff' }}>Performance Metrics</h4>
            <div style={{ display: 'flex', gap: '15px', color: '#cbd5e1' }}>
                <div>Loaded in: {metrics.loadTime ? `${Math.round(metrics.loadTime)}ms` : 'Waiting...'}</div>
                <div>DOM Ready: {metrics.domContentLoaded ? `${Math.round(metrics.domContentLoaded)}ms` : 'Waiting...'}</div>
            </div>
        </div>
    );
}
