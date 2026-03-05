import React, { useState, useEffect, useContext, useReducer, useCallback } from 'react';
import { DataContext } from '../contexts/DataContext';
import { ChartContainer } from './ChartContainer';
import { MetricsCard } from './MetricsCard';
import { PerformanceMonitor } from './PerformanceMonitor';
import { ErrorBoundary } from './ErrorBoundary';
import { DashboardHeader } from './DashboardHeader';
import { MetricsGrid } from './MetricsGrid';
import './Dashboard.css';

const initialState = {
    loading: false,
    error: null,
    data: {
        users: [],
        revenue: [],
        orders: []
    },
    filters: {
        dateRange: '30d',
        category: 'all'
    }
};

function dataReducer(state, action) {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload, loading: false };
        case 'SET_DATA':
            return { ...state, data: action.payload, loading: false, error: null };
        case 'UPDATE_FILTERS':
            return { ...state, filters: { ...state.filters, ...action.payload } };
        case 'RESET':
            return initialState;
        default:
            return state;
    }
}

export function Dashboard() {
    const [state, dispatch] = useReducer(dataReducer, initialState);
    const [selectedMetric, setSelectedMetric] = useState('revenue');
    const [viewMode, setViewMode] = useState('grid');

    const { fetchData, subscribe, clearCache } = useContext(DataContext);

    const loadData = useCallback(async () => {
        dispatch({ type: 'SET_LOADING', payload: true });

        try {
            const [users, revenue, orders] = await Promise.all([
                fetchData('/api/users'),
                fetchData('/api/revenue'),
                fetchData('/api/orders')
            ]);

            dispatch({
                type: 'SET_DATA',
                payload: { users, revenue, orders }
            });
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error.message });
        }
    }, [fetchData]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    useEffect(() => {
        const handleDataUpdate = (endpoint, data) => {
            const endpointMap = {
                '/api/users': 'users',
                '/api/revenue': 'revenue',
                '/api/orders': 'orders'
            };
            const key = endpointMap[endpoint];
            if (key) {
                dispatch({
                    type: 'SET_DATA',
                    payload: { ...state.data, [key]: data }
                });
            }
        };

        const unsubscribeFn = subscribe(handleDataUpdate);
        return () => {
            if (unsubscribeFn) unsubscribeFn();
        };
    }, [subscribe, state.data]);

    const handleFilterChange = (filterType, value) => {
        dispatch({
            type: 'UPDATE_FILTERS',
            payload: { [filterType]: value }
        });
        // Filtering mock trigger
        handleRefresh();
    };

    const handleRefresh = async () => {
        clearCache();
        await loadData();
    };

    if (state.loading && (!state.data.users || state.data.users.length === 0)) {
        return <LoadingSpinner />;
    }

    if (state.error && (!state.data.users || state.data.users.length === 0)) {
        return <ErrorMessage error={state.error} onRetry={handleRefresh} />;
    }

    return (
        <ErrorBoundary>
            <div className="dashboard">
                <DashboardHeader
                    filters={state.filters}
                    onFilterChange={handleFilterChange}
                    onRefresh={handleRefresh}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                />

                <div className={`dashboard-content ${viewMode}`}>
                    <MetricsGrid data={state.data} />

                    <div className="charts-section">
                        <ChartContainer
                            data={state.data}
                            selectedMetric={selectedMetric}
                            onMetricChange={setSelectedMetric}
                        />
                    </div>

                    <PerformanceMonitor />
                </div>
            </div>
        </ErrorBoundary>
    );
}

// Loading component
function LoadingSpinner() {
    return (
        <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading dashboard data...</p>
        </div>
    );
}

// Error component
function ErrorMessage({ error, onRetry }) {
    return (
        <div className="error-container">
            <h2>Error Loading Dashboard</h2>
            <p>{error}</p>
            <button onClick={onRetry} className="retry-btn">
                Try Again
            </button>
        </div>
    );
}
