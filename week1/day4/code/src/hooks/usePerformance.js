import { useCallback, useEffect, useState } from 'react';

const usePerformance = () => {
    const [metrics, setMetrics] = useState({
        loadTime: 0,
        interactionCount: 0,
        memoryUsage: 0
    });

    const updateMetrics = useCallback(() => {
        const loadTime = Math.round(performance.now());

        const memoryUsage = performance.memory
            ? Math.round(
                  performance.memory.usedJSHeapSize / 1024 / 1024
              )
            : 0;

        setMetrics((prev) => ({
            ...prev,
            loadTime,
            memoryUsage
        }));
    }, []);

    useEffect(() => {
        updateMetrics();

        const handleInteraction = () => {
            setMetrics((prev) => ({
                ...prev,
                interactionCount: prev.interactionCount + 1
            }));
        };

        window.addEventListener('click', handleInteraction);

        return () => {
            window.removeEventListener('click', handleInteraction);
        };
    }, [updateMetrics]);

    return {
        metrics,
        updateMetrics
    };
};

export default usePerformance;