import React, { useContext, useEffect, useReducer } from 'react';
import { DataContext } from '../contexts/DataContext';
import ChartContainer from './ChartContainer';
import MetricsCard from './MetricsCard';
import PerformanceMonitor from './PerformanceMonitor';
import ErrorBoundary from './ErrorBoundary';

const initialState = {
    loading: false,
    error: null,
    data: {},
    filters: {
        timeRange: '6months'
    }
};

const dashboardReducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_START':
            return {
                ...state,
                loading: true,
                error: null
            };

        case 'FETCH_SUCCESS':
            return {
                ...state,
                loading: false,
                data: action.payload
            };

        case 'FETCH_ERROR':
            return {
                ...state,
                loading: false,
                error: action.error
            };

        case 'SET_FILTER':
            return {
                ...state,
                filters: {
                    ...state.filters,
                    [action.key]: action.value
                }
            };

        default:
            return state;
    }
};

const Dashboard = () => {
    const [state, dispatch] = useReducer(
        dashboardReducer,
        initialState
    );

    const dataContext = useContext(DataContext);

    useEffect(() => {
        const loadDashboardData = async () => {
            dispatch({ type: 'FETCH_START' });

            try {
                const [users, revenue, orders] = await Promise.all([
                    dataContext.fetchData('users', async () => ({
                        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                        values: [120, 180, 250, 320, 410, 520]
                    })),
                    dataContext.fetchData('revenue', async () => ({
                        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                        values: [12000, 18000, 24000, 31000, 39000, 47000]
                    })),
                    dataContext.fetchData('orders', async () => ({
                        labels: [
                            'Completed',
                            'Pending',
                            'Cancelled',
                            'Returned'
                        ],
                        values: [450, 120, 50, 30]
                    }))
                ]);

                dispatch({
                    type: 'FETCH_SUCCESS',
                    payload: {
                        users,
                        revenue,
                        orders
                    }
                });
            } catch (error) {
                dispatch({
                    type: 'FETCH_ERROR',
                    error: error.message
                });
            }
        };

        loadDashboardData();
    }, [dataContext]);

    if (state.loading) {
        return (
            <div className="dashboard-loading">
                Loading dashboard...
            </div>
        );
    }

    if (state.error) {
        return (
            <div className="dashboard-error">
                <h2>Failed to load dashboard</h2>
                <p>{state.error}</p>
            </div>
        );
    }

    const revenueData = state.data.revenue;
    const userData = state.data.users;
    const orderData = state.data.orders;

    const revenueChart = revenueData
        ? {
              labels: revenueData.labels,
              datasets: [
                  {
                      label: 'Revenue',
                      data: revenueData.values,
                      borderWidth: 2
                  }
              ]
          }
        : null;

    const userChart = userData
        ? {
              labels: userData.labels,
              datasets: [
                  {
                      label: 'Users',
                      data: userData.values,
                      borderWidth: 1
                  }
              ]
          }
        : null;

    const orderChart = orderData
        ? {
              labels: orderData.labels,
              datasets: [
                  {
                      label: 'Orders',
                      data: orderData.values,
                      borderWidth: 1
                  }
              ]
          }
        : null;

    return (
        <ErrorBoundary>
            <div className="dashboard">
                <div className="dashboard-header">
                    <div>
                        <h1>Advanced React Dashboard</h1>
                        <p>
                            Monitor your application data and
                            performance.
                        </p>
                    </div>

                    <select
                        value={state.filters.timeRange}
                        onChange={(event) =>
                            dispatch({
                                type: 'SET_FILTER',
                                key: 'timeRange',
                                value: event.target.value
                            })
                        }
                    >
                        <option value="6months">Last 6 Months</option>
                        <option value="3months">Last 3 Months</option>
                        <option value="1month">Last Month</option>
                    </select>
                </div>

                <div className="metrics-grid">
                    <MetricsCard
                        title="Total Users"
                        value={
                            userData
                                ? userData.values[
                                      userData.values.length - 1
                                  ]
                                : 0
                        }
                        change={12.5}
                        icon="👥"
                    />

                    <MetricsCard
                        title="Revenue"
                        value={
                            revenueData
                                ? `₹${revenueData.values[
                                      revenueData.values.length - 1
                                  ].toLocaleString()}`
                                : '₹0'
                        }
                        change={8.3}
                        icon="₹"
                    />

                    <MetricsCard
                        title="Total Orders"
                        value={
                            orderData
                                ? orderData.values.reduce(
                                      (sum, value) => sum + value,
                                      0
                                  )
                                : 0
                        }
                        change={5.7}
                        icon="📦"
                    />
                </div>

                <div className="charts-grid">
                    {revenueChart && (
                        <div className="chart-card">
                            <h2>Revenue Overview</h2>
                            <ChartContainer
                                type="line"
                                data={revenueChart}
                            />
                        </div>
                    )}

                    {userChart && (
                        <div className="chart-card">
                            <h2>User Growth</h2>
                            <ChartContainer
                                type="bar"
                                data={userChart}
                            />
                        </div>
                    )}

                    {orderChart && (
                        <div className="chart-card">
                            <h2>Order Distribution</h2>
                            <ChartContainer
                                type="doughnut"
                                data={orderChart}
                            />
                        </div>
                    )}
                </div>

                <PerformanceMonitor />
            </div>
        </ErrorBoundary>
    );
};

export default Dashboard;