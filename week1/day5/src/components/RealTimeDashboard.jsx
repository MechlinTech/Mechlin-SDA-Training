import React, { useState, useEffect } from 'react';
import { useRealTimeData } from '../hooks/useRealTimeData';
import { MetricsCard } from './MetricsCard';
import { ChartContainer } from './ChartContainer';
import { ConnectionStatus } from './ConnectionStatus';

export function RealTimeDashboard() {
    const [selectedMetric, setSelectedMetric] = useState('revenue');
    const [autoRefresh, setAutoRefresh] = useState(true);

    // Custom Hook instances! They automatically handle fetching initial data + listening to WS
    const {
        data: revenueData,
        loading: revenueLoading,
        error: revenueError,
        isConnected: revenueConnected,
        refresh: refreshRevenue
    } = useRealTimeData('/api/revenue', { enableRealTime: true });

    const {
        data: userData,
        loading: userLoading,
        error: userError,
        isConnected: userConnected,
        refresh: refreshUsers
    } = useRealTimeData('/api/users', { enableRealTime: true });

    const {
        data: orderData,
        loading: orderLoading,
        error: orderError,
        isConnected: orderConnected,
        refresh: refreshOrders
    } = useRealTimeData('/api/orders', { enableRealTime: true });

    // Fallback Auto-refresh logic (Polling) - In case WebSockets drop completely
    useEffect(() => {
        if (!autoRefresh) return;

        // If WebSockets are connected, relying on polling is redundant. 
        // We only poll if they are offline.
        const interval = setInterval(() => {
            if (!revenueConnected) refreshRevenue();
            if (!userConnected) refreshUsers();
            if (!orderConnected) refreshOrders();
        }, 15000); // Poll every 15 seconds if WS is dead

        return () => clearInterval(interval);
    }, [autoRefresh, revenueConnected, userConnected, orderConnected, refreshRevenue, refreshUsers, refreshOrders]);

    const handleRefreshAll = () => {
        refreshRevenue();
        refreshUsers();
        refreshOrders();
    };

    const getConnectionStatus = () => {
        const connections = [revenueConnected, userConnected, orderConnected];
        const connectedCount = connections.filter(Boolean).length;

        if (connectedCount === 0) return 'disconnected';
        if (connectedCount === connections.length) return 'connected';
        return 'partial';
    };

    // Prevent UI flashing by showing a nice spinner until initial data answers
    if (revenueLoading && userLoading && orderLoading && !revenueData) {
        return <LoadingSpinner />;
    }

    return (
        <div className="real-time-dashboard">
            <div className="dashboard-header">
                <div>
                    <h1>Real-Time Operations</h1>
                    <p style={{ margin: '0.5rem 0 0 0', color: '#94a3b8' }}>Monitor key business metrics live.</p>
                </div>

                <div className="dashboard-controls">
                    <ConnectionStatus status={getConnectionStatus()} />

                    <button
                        className="refresh-btn"
                        onClick={handleRefreshAll}
                        disabled={revenueLoading || userLoading || orderLoading}
                    >
                        Force Sync
                    </button>

                    <label className="auto-refresh-toggle">
                        <input
                            type="checkbox"
                            style={{ accentColor: '#3b82f6', width: '16px', height: '16px', cursor: 'pointer' }}
                            checked={autoRefresh}
                            onChange={(e) => setAutoRefresh(e.target.checked)}
                        />
                        HTTP Fallback Polling
                    </label>
                </div>
            </div>

            <div className="metrics-grid">
                <MetricsCard
                    title="Revenue"
                    value={revenueData?.total || 0}
                    change={revenueData?.change || 0}
                    loading={revenueLoading}
                    error={revenueError}
                    connected={revenueConnected}
                    onRefresh={refreshRevenue}
                />
                <MetricsCard
                    title="Active Users"
                    value={userData?.total || 0}
                    change={userData?.change || 0}
                    loading={userLoading}
                    error={userError}
                    connected={userConnected}
                    onRefresh={refreshUsers}
                />
                <MetricsCard
                    title="Orders Processed"
                    value={orderData?.total || 0}
                    change={orderData?.change || 0}
                    loading={orderLoading}
                    error={orderError}
                    connected={orderConnected}
                    onRefresh={refreshOrders}
                />
            </div>

            <div className="charts-section">
                <ChartContainer
                    data={{
                        revenue: revenueData,
                        users: userData,
                        orders: orderData
                    }}
                    selectedMetric={selectedMetric}
                    onMetricChange={setSelectedMetric}
                    realTime={true}
                />
            </div>
        </div>
    );
}

function LoadingSpinner() {
    return (
        <div className="loading-container">
            <div className="spinner"></div>
            <div>Establishing Data Streams...</div>
        </div>
    );
}
