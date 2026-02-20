import { useEffect, useReducer, useCallback } from "react";
import { useDataContext } from "../contexts/DataContext";

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
  const { fetchData } = useDataContext();
  const [state, dispatch] = useReducer(reducer, initialState);

  const loadData = useCallback(async () => {
    dispatch({ type: "SET_LOADING" });

    try {
      const [users, revenue, orders] = await Promise.all([
        fetchData("/api/users"),
        fetchData("/api/revenue"),
        fetchData("/api/orders")
      ]);

      dispatch({
        type: "SET_DATA",
        payload: { users, revenue, orders }
      });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: error.message
      });
    }
  }, [fetchData]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { ...state, refetch: loadData };
}