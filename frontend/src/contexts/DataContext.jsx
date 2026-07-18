import { createContext, useContext, useState } from "react";

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

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  return (

    <DataContext.Provider
      value={{
        metrics,
        setMetrics,
        loading,
        setLoading,
        error,
        setError,
      }}
    >
      {children}
    </DataContext.Provider>

  );

}

export function useData() {
  return useContext(DataContext);
}