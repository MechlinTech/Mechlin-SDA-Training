import { useEffect, useMemo, useState } from "react";
import useRealTimeData from "../hooks/useRealTimeData";
import MetricsCard from "./MetricsCard";
import ChartContainer from "./ChartContainer";
import ConnectionStatus from "./ConnectionStatus";
import "./RealTimeDashboard.css";

function RealTimeDashboard() {
  const [selectedMetric, setSelectedMetric] = useState("revenue");
  const [autoRefresh, setAutoRefresh] = useState(true);

  const revenueData = useRealTimeData("/api/revenue", {
    enableRealTime: true,
    websocketUrl: "ws://localhost:3000",
  });

  const usersData = useRealTimeData("/api/users", {
    enableRealTime: true,
    websocketUrl: "ws://localhost:3000",
  });

  const ordersData = useRealTimeData("/api/orders", {
    enableRealTime: true,
    websocketUrl: "ws://localhost:3000",
  });

  const dataSources = useMemo(
    () => [revenueData, usersData, ordersData],
    [revenueData, usersData, ordersData]
  );

  const isConnected = dataSources.some((source) => source.isConnected);
  const allConnected = dataSources.every((source) => source.isConnected);

  const connectionStatus = allConnected
    ? "connected"
    : isConnected
      ? "partial"
      : "disconnected";

  useEffect(() => {
    if (!autoRefresh || !isConnected) {
      return;
    }

    const interval = setInterval(() => {
      revenueData.refresh();
      usersData.refresh();
      ordersData.refresh();
    }, 30000);

    return () => {
      clearInterval(interval);
    };
  }, [
    autoRefresh,
    isConnected,
    revenueData.refresh,
    usersData.refresh,
    ordersData.refresh,
  ]);

  const handleRefreshAll = () => {
    revenueData.refresh();
    usersData.refresh();
    ordersData.refresh();
  };

  const isLoading =
    revenueData.loading || usersData.loading || ordersData.loading;

  const errors = [
    revenueData.error,
    usersData.error,
    ordersData.error,
  ].filter(Boolean);

  const chartData = {
    revenue: revenueData.data,
    users: usersData.data,
    orders: ordersData.data,
  };

  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner" />
        <p>Loading real-time dashboard...</p>
      </div>
    );
  }

  return (
    <div className="realtime-dashboard">
      <header className="dashboard-header">
        <div>
          <p className="dashboard-eyebrow">LIVE ANALYTICS</p>
          <h1>Real-Time Dashboard</h1>
          <p className="dashboard-subtitle">
            Monitor revenue, users, and orders with live updates.
          </p>
        </div>

        <div className="dashboard-actions">
          <ConnectionStatus
            status={connectionStatus}
            onReconnect={handleRefreshAll}
          />

          <button
            type="button"
            className="dashboard-button"
            onClick={handleRefreshAll}
          >
            Refresh All
          </button>

          <label className="auto-refresh-control">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(event) => setAutoRefresh(event.target.checked)}
            />
            Auto Refresh
          </label>
        </div>
      </header>

      {errors.length > 0 && (
        <div className="dashboard-error">
          <strong>Some data could not be loaded.</strong>
          <button type="button" onClick={handleRefreshAll}>
            Retry
          </button>
        </div>
      )}

      <section className="metrics-grid">
        <MetricsCard
          title="Revenue"
          value={revenueData.data?.value ?? revenueData.data?.total ?? 0}
          change={revenueData.data?.change ?? 0}
          selected={selectedMetric === "revenue"}
          onClick={() => setSelectedMetric("revenue")}
        />

        <MetricsCard
          title="Users"
          value={usersData.data?.value ?? usersData.data?.total ?? 0}
          change={usersData.data?.change ?? 0}
          selected={selectedMetric === "users"}
          onClick={() => setSelectedMetric("users")}
        />

        <MetricsCard
          title="Orders"
          value={ordersData.data?.value ?? ordersData.data?.total ?? 0}
          change={ordersData.data?.change ?? 0}
          selected={selectedMetric === "orders"}
          onClick={() => setSelectedMetric("orders")}
        />
      </section>

      <section className="dashboard-chart-section">
        <ChartContainer
          title={`${selectedMetric.charAt(0).toUpperCase()}${selectedMetric.slice(
            1
          )} Overview`}
          data={chartData[selectedMetric]}
          metric={selectedMetric}
        />
      </section>
    </div>
  );
}

export default RealTimeDashboard;