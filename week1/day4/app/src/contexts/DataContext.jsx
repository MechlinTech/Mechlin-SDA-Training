/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useReducer,
  useCallback
} from 'react';

export const DataContext = createContext(null);

const mockData = {
  '/users': [
    { name: 'Jan', value: 120 },
    { name: 'Feb', value: 145 },
    { name: 'Mar', value: 170 },
    { name: 'Apr', value: 190 },
    { name: 'May', value: 215 },
    { name: 'Jun', value: 240 }
  ],

  '/revenue': [
    { name: 'Jan', value: 12000 },
    { name: 'Feb', value: 14500 },
    { name: 'Mar', value: 16800 },
    { name: 'Apr', value: 19200 },
    { name: 'May', value: 22500 },
    { name: 'Jun', value: 25000 }
  ],

  '/orders': [
    { name: 'Jan', value: 80 },
    { name: 'Feb', value: 95 },
    { name: 'Mar', value: 110 },
    { name: 'Apr', value: 125 },
    { name: 'May', value: 140 },
    { name: 'Jun', value: 155 }
  ]
};

const initialState = {
  cache: new Map(),
  subscribers: new Set(),
  loading: false,
  error: null
};

function dataReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };

    case 'CACHE_DATA': {
      const newCache = new Map(state.cache);

      newCache.set(
        action.payload.key,
        action.payload.data
      );

      return {
        ...state,
        cache: newCache,
        loading: false,
        error: null
      };
    }

    case 'CLEAR_CACHE':
      return {
        ...state,
        cache: new Map()
      };

    default:
      return state;
  }
}

export function DataProvider({ children }) {
  const [state, dispatch] = useReducer(
    dataReducer,
    initialState
  );

  const fetchData = useCallback(
    async (endpoint) => {
      const cachedData = state.cache.get(endpoint);

      if (cachedData !== undefined) {
        return cachedData;
      }

      dispatch({
        type: 'SET_LOADING',
        payload: true
      });

      try {
        const response = await fetch(`/api${endpoint}`);

        const contentType =
          response.headers.get('content-type') || '';

        if (
          response.ok &&
          contentType.includes('application/json')
        ) {
          const data = await response.json();

          dispatch({
            type: 'CACHE_DATA',
            payload: {
              key: endpoint,
              data
            }
          });

          state.subscribers.forEach((callback) => {
            callback(endpoint, data);
          });

          return data;
        }

        throw new Error('API unavailable');
      } catch {
        // Local fallback for the standalone Day 4 Vite app.
        const data = mockData[endpoint] || [];

        dispatch({
          type: 'CACHE_DATA',
          payload: {
            key: endpoint,
            data
          }
        });

        state.subscribers.forEach((callback) => {
          callback(endpoint, data);
        });

        return data;
      }
    },
    [state.cache, state.subscribers]
  );

  const subscribe = useCallback(
    (callback) => {
      state.subscribers.add(callback);

      return () => {
        state.subscribers.delete(callback);
      };
    },
    [state.subscribers]
  );

  const clearCache = useCallback(() => {
    dispatch({
      type: 'CLEAR_CACHE'
    });
  }, []);

  const value = {
    fetchData,
    subscribe,
    clearCache,
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
  const context = useContext(DataContext);

  if (!context) {
    throw new Error(
      'useDataContext must be used inside DataProvider'
    );
  }

  return context;
}