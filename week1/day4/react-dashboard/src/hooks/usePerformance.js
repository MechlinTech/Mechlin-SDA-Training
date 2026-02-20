import { useEffect, useRef, useState } from "react";

export function usePerformance(componentName) {

  const renderCount = useRef(0);
  const [metrics, setMetrics] = useState({});

  renderCount.current += 1;

  useEffect(() => {

    const navigation = performance.getEntriesByType("navigation")[0];
    const paint = performance.getEntriesByType("paint");

    setMetrics({
      renders: renderCount.current,
      loadTime: navigation?.loadEventEnd - navigation?.startTime,
      firstPaint: paint.find(p => p.name === "first-paint")?.startTime,
      firstContentfulPaint:
        paint.find(p => p.name === "first-contentful-paint")?.startTime
    });

  }, []);

  return metrics;
}