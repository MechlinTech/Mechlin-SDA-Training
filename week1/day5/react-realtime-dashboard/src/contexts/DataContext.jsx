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
      return { ...state, cache: newCache };
    }
    case 'CLEAR_CACHE':
      return { ...state, cache: new Map() };
    default:
      return state;
  }
}

export function DataProvider({ children }) {
  const [state, dispatch] = useReducer(dataContextReducer, initialState);

  // MOCK API since we don't have a backend!
  const getMockData = (endpoint) => {
    return new Promise(resolve => {
        setTimeout(() => {
            if (endpoint === '/api/users') {
                resolve({ labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], values: [120, 150, 180, 140, 210] });
            } else if (endpoint === '/api/revenue') {
                resolve({ labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], values: [1200, 1900, 1500, 2200, 2800] });
            } else if (endpoint === '/api/orders') {
                resolve({ labels: ['Electronics', 'Clothing', 'Food'], values: [300, 150, 400] });
            } else {
                resolve({ labels: [], values: [] });
            }
        }, 400); 
    });
  };

  const fetchData = useCallback(async (endpoint, options = {}) => {
    const cacheKey = `${endpoint}-${JSON.stringify(options)}`;
    
    if (state.cache.has(cacheKey)) {
      return state.cache.get(cacheKey);
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const data = await getMockData(endpoint);
      dispatch({ type: 'CACHE_DATA', key: cacheKey, data });
      return data;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, [state.cache]);

  const value = {
    fetchData,
    loading: state.loading,
    error: state.error
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export function useDataContext() {
  return useContext(DataContext);
}
