import { useState, useEffect, useReducer, useCallback } from "react";
import { useDataContext } from "../contexts/DataContext";
import { fetchData } from "../services/api";

const initialState = {
  loading: true,
  error: null,
  data: {
    users: [],
    revenue: [],
    orders: []
  }
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: true };

    case "SET_DATA":
      return {
        ...state,
        loading: false,
        error: null,
        data: action.payload
      };

    case "SET_ERROR":
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    default:
      return state;
  }
}

export function useDashboardData() {
  const [data, setData] = useState({
    users: null,
    revenue: null,
    orders: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [users, revenue, orders] = await Promise.all([
        fetchData("/users"),
        fetchData("/revenue"),
        fetchData("/orders")
      ]);

      setData({ users, revenue, orders });
      setError(null);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
  const interval = setInterval(() => {
    loadData();
  }, 5000); // refresh every 5 sec

  return () => clearInterval(interval);
  }, [loadData]);

  return {
  loading,
  error,
  data,
  refetch: loadData,
  lastUpdated
  };
}