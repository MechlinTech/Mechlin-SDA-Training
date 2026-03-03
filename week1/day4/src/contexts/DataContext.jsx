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
        case 'CACHE_DATA':
            const newCache = new Map(state.cache);
            newCache.set(action.key, action.data);
            return { ...state, cache: newCache };
        case 'CLEAR_CACHE':
            return { ...state, cache: new Map() };
        default:
            return state;
    }
}

export function DataProvider({ children }) {
    const [state, dispatch] = useReducer(dataContextReducer, initialState);

    const fetchData = useCallback(async (endpoint, options = {}) => {
        const cacheKey = `${endpoint}-${JSON.stringify(options)}`;

        if (state.cache.has(cacheKey)) {
            return state.cache.get(cacheKey);
        }

        dispatch({ type: 'SET_LOADING', payload: true });

        try {
            // Mock network delay
            await new Promise(resolve => setTimeout(resolve, 800));

            let data = null;

            // Generate more realistic mock data for charts
            if (endpoint === '/api/users') {
                data = {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    values: [150, 230, 180, 290, 310, 420],
                    length: 1580 // Fake total count
                };
            }
            if (endpoint === '/api/revenue') {
                data = {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    values: [1200, 1900, 1500, 2200, 2800, 3100],
                    reduce: () => 12700 // Mock reduce for total
                };
            }
            if (endpoint === '/api/orders') {
                data = {
                    labels: ['Electronics', 'Clothing', 'Books', 'Home'],
                    values: [45, 25, 20, 10],
                    length: 345 // Fake total count
                };
            }

            dispatch({ type: 'CACHE_DATA', key: cacheKey, data });
            return data;
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error.message });
            throw error;
        }
    }, [state.cache]);

    const subscribe = useCallback((callback) => {
        state.subscribers.add(callback);
        return () => state.subscribers.delete(callback);
    }, [state.subscribers]);

    const clearCache = useCallback(() => {
        dispatch({ type: 'CLEAR_CACHE' });
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
        throw new Error('useDataContext must be used within a DataProvider');
    }
    return context;
}

export { DataContext };
