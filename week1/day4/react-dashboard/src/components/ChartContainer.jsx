import { useEffect, useRef } from 'react';
import { ChartManager } from '../modules/ChartManager';
import { useDataContext } from '../contexts/DataContext';

export function ChartContainer() {
  const containerRef = useRef(null);
  const managerRef = useRef(null);
  const initializedRef = useRef(false); // 🔑 KEY FIX
  const { fetchData, subscribe } = useDataContext();

  useEffect(() => {
    if (!containerRef.current) return;
    if (initializedRef.current) return; // 🚫 block second init

    initializedRef.current = true;

    const dataManager = {
      fetchData,
      subscribe
    };

    managerRef.current = new ChartManager('charts-grid', dataManager);

    return () => {
      if (managerRef.current) {
        managerRef.current.destroyAllCharts();
        managerRef.current = null;
      }
    };
  }, [fetchData, subscribe]);

  return (
    <div className="charts-grid" ref={containerRef}>
      <canvas id="revenueChart" />
      <canvas id="userChart" />
      <canvas id="orderChart" />
      <canvas id="performanceChart" />
    </div>
  );
}

