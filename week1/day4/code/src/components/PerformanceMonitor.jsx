import React, { useEffect, useState } from 'react';

const PerformanceMonitor = () => {
    const [metrics, setMetrics] = useState({
        loadTime: 0,
        interactionCount: 0,
        memory: 0
    });

    useEffect(() => {
        const loadTime = performance.now();

        const updateMetrics = () => {
            const memory = performance.memory
                ? Math.round(
                      performance.memory.usedJSHeapSize /
                          1024 /
                          1024
                  )
                : 0;

            setMetrics({
                loadTime: Math.round(loadTime),
                interactionCount: 0,
                memory
            });
        };

        updateMetrics();
    }, []);

    return (
        <div className="performance-monitor">
            <h3>Performance Monitor</h3>

            <div className="performance-metrics">
                <div>
                    <strong>{metrics.loadTime} ms</strong>
                    <span>Load Time</span>
                </div>

                <div>
                    <strong>{metrics.interactionCount}</strong>
                    <span>Interactions</span>
                </div>

                <div>
                    <strong>{metrics.memory} MB</strong>
                    <span>Memory Used</span>
                </div>
            </div>
        </div>
    );
};

export default PerformanceMonitor;