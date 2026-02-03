// src/contexts/DataContext.jsx
import React, { createContext, useContext, useReducer, useCallback } from 'react';

const DataContext = createContext();

const initialState = {
  cache: new Map(),
  subscribers: new Set(),
  loading: false,
  error: null
};

function dataContextReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'CACHE_DATA': {
      const newCache = new Map(state.cache);
      newCache.set(action.key, action.data);
      return { ...state, cache: newCache, loading: false };
    }
    case 'CLEAR_CACHE':
      return { ...state, cache: new Map() };
    default:
      return state;
  }
}

export function DataProvider({ children }) {
  const [state, dispatch] = useReducer(dataContextReducer, initialState);

  const fetchData = useCallback(async (endpoint) => {
    const cacheKey = endpoint;

    if (state.cache.has(cacheKey)) {
      return state.cache.get(cacheKey);
    }

    dispatch({ type: 'SET_LOADING', payload: true });

    // ⬇️ MOCK DATA (NO BACKEND REQUIRED)
    await new Promise(res => setTimeout(res, 500));

    let data;
    switch (endpoint) {
      case '/api/users':
        data = {
          labels: ['Jan', 'Feb', 'Mar', 'Apr'],
          values: [120, 180, 260, 320]
        };
        break;

      case '/api/revenue':
        data = {
          labels: ['Jan', 'Feb', 'Mar', 'Apr'],
          values: [1200, 1500, 2100, 2800]
        };
        break;

      case '/api/orders':
        data = {
          labels: ['Completed', 'Pending', 'Cancelled'],
          values: [65, 25, 10]
        };
        break;

      default:
        data = { labels: [], values: [] };
    }

    dispatch({ type: 'CACHE_DATA', key: cacheKey, data });
    return data;
  }, [state.cache]);

  const subscribe = useCallback((callback) => {
    state.subscribers.add(callback);
    return () => state.subscribers.delete(callback);
  }, [state.subscribers]);

  const clearCache = useCallback(() => {
    dispatch({ type: 'CLEAR_CACHE' });
  }, []);

  return (
    <DataContext.Provider
      value={{
        fetchData,
        subscribe,
        clearCache,
        loading: state.loading,
        error: state.error
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useDataContext() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useDataContext must be used within a DataProvider');
  }
  return context;
}

export { DataContext };
