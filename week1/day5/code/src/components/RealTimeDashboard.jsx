import React, { useEffect, useMemo, useState } from 'react';
import { useRealTimeData } from '../hooks/useRealTimeData';
import ConnectionStatus from './ConnectionStatus';

const RealTimeDashboard = () => {
    const [selectedMetric, setSelectedMetric] = useState('revenue');
    const [autoRefresh, setAutoRefresh] = useState(true);

const revenue = useRealTimeData('/api/revenue', {
    enableRealTime: true,
    wsUrl: 'ws://localhost:8080'
});    
const users = useRealTimeData('/api/users', {
    enableRealTime: true,
    wsUrl: 'ws://localhost:8080'
});

const orders = useRealTimeData('/api/orders', {
    enableRealTime: true,
    wsUrl: 'ws://localhost:8080'
});

    const metricData = useMemo(() => {
        return {
            revenue,
            users,
            orders
        };
    }, [revenue, users, orders]);

    const currentMetric = metricData[selectedMetric];

    useEffect(() => {
        if (!autoRefresh) return;

        const interval = setInterval(() => {
            currentMetric.refresh();
        }, 30000);

        return () => clearInterval(interval);
    }, [autoRefresh, currentMetric]);

    const getValue = (data) => {
        if (!data) return 'Loading...';

        if (Array.isArray(data.values)) {
            return data.values[data.values.length - 1];
        }

        return data.value ?? 'N/A';
    };

    const getTotal = (data) => {
        if (!data || !Array.isArray(data.values)) {
            return 0;
        }

        return data.values.reduce(
            (total, value) => total + Number(value || 0),
            0
        );
    };

    const handleRefresh = () => {
        currentMetric.refresh();
    };

    return (
        <div className="realtime-dashboard">
            <div className="dashboard-header">
                <div>
                    <h1>Real-Time Dashboard</h1>
                    <p>
                        Monitor your application data and
                        performance in real time.
                    </p>
                </div>

                <ConnectionStatus
                    status={
                        currentMetric.isConnected
                            ? 'connected'
                            : 'disconnected'
                    }
                    onReconnect={() => currentMetric.refresh()}
                />
            </div>

            <div className="dashboard-controls">
                <label htmlFor="metric">
                    Select Metric:
                </label>

                <select
                    id="metric"
                    value={selectedMetric}
                    onChange={(event) =>
                        setSelectedMetric(event.target.value)
                    }
                >
                    <option value="revenue">Revenue</option>
                    <option value="users">Users</option>
                    <option value="orders">Orders</option>
                </select>

                <button
                    type="button"
                    onClick={handleRefresh}
                    disabled={currentMetric.loading}
                >
                    {currentMetric.loading
                        ? 'Refreshing...'
                        : 'Refresh Data'}
                </button>

                <label className="auto-refresh">
                    <input
                        type="checkbox"
                        checked={autoRefresh}
                        onChange={(event) =>
                            setAutoRefresh(event.target.checked)
                        }
                    />
                    Auto Refresh
                </label>
            </div>

            {currentMetric.error && (
                <div className="error-message">
                    Error: {currentMetric.error}
                </div>
            )}

            <div className="metric-cards">
                <div className="metric-card">
                    <h3>Current Value</h3>
                    <p>{getValue(currentMetric.data)}</p>
                </div>

                <div className="metric-card">
                    <h3>Total</h3>
                    <p>{getTotal(currentMetric.data)}</p>
                </div>

                <div className="metric-card">
                    <h3>Status</h3>
                    <p>
                        {currentMetric.loading
                            ? 'Loading'
                            : currentMetric.error
                            ? 'Error'
                            : 'Ready'}
                    </p>
                </div>
            </div>

            <div className="data-section">
                <h2>
                    {selectedMetric.charAt(0).toUpperCase() +
                        selectedMetric.slice(1)}{' '}
                    Data
                </h2>

                {currentMetric.data ? (
                    <div className="data-display">
                        <div className="data-labels">
                            {currentMetric.data.labels?.map(
                                (label) => (
                                    <span key={label}>
                                        {label}
                                    </span>
                                )
                            )}
                        </div>

                        <div className="data-values">
                            {currentMetric.data.values?.map(
                                (value, index) => (
                                    <div
                                        className="data-bar"
                                        key={`${value}-${index}`}
                                        style={{
                                            height: `${Math.max(
                                                20,
                                                Math.min(
                                                    100,
                                                    Number(value) /
                                                        Math.max(
                                                            ...currentMetric.data.values
                                                        ) *
                                                        100
                                                )
                                            )}%`
                                        }}
                                        title={`${value}`}
                                    >
                                        <span>{value}</span>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                ) : (
                    <p>No data available.</p>
                )}
            </div>

            <div className="update-info">
                <strong>Last Update:</strong>{' '}
                {currentMetric.getLastUpdate()
                    ? new Date(
                          currentMetric.getLastUpdate()
                      ).toLocaleTimeString()
                    : 'Not available'}
            </div>
        </div>
    );
};

export default RealTimeDashboard;