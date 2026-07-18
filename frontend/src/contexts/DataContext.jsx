import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

import dashboardService from "../services/DashboardService";

const DataContext = createContext();

export function DataProvider({ children }) {
  const [metrics, setMetrics] = useState({
    users: 0,
    revenue: 0,
    orders: 0,
    growthRate: 0,
    months: [],
    revenueHistory: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const dashboard = await dashboardService.getDashboardMetrics();

      setMetrics(dashboard);
    } catch (err) {
      console.error("Dashboard Load Error:", err);
      setError(err.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshDashboard = useCallback(async () => {
    dashboardService.clearCache();
    await loadDashboard();
  }, [loadDashboard]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  return (
    <DataContext.Provider
      value={{
        metrics,
        setMetrics,

        loading,
        setLoading,

        error,
        setError,

        refreshDashboard,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}