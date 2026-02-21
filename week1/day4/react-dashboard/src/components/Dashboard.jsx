import React from "react";
import { usePerformance } from "../hooks/usePerformance";
import { MetricsCard } from "./MetricsCard";
import { useDashboardData } from "../hooks/useDashboardData";
import { useTheme } from "../contexts/ThemeContext";

export function Dashboard() {

  const { loading, error, data, refetch, lastUpdated } = useDashboardData();
  const perf = usePerformance("Dashboard");
  const theme = useTheme();

  if (loading) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>Loading...</h2>
        <div style={{
          height: "120px",
          background: "#e5e7eb",
          borderRadius: "8px",
          marginTop: "20px",
          animation: "pulse 1.5s infinite"
        }} />
      </div>
    );
  }  
  if (error) return <h2>Error: {error}</h2>;

  return (
    // same JSX as before
    <div style={{
  padding: "20px",
  background: theme.background,
  color: theme.text,
  minHeight: "100vh",
  transition: "all 0.3s ease"
}}>
    <h1>React Advanced Dashboard</h1>
    <button
    onClick={theme.toggleTheme}
    style={{
        padding: "8px 12px",
        marginRight: "10px",
        background: theme.darkMode ? "#facc15" : "#1f2937",
        color: theme.darkMode ? "#111" : "#fff",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer"
    }}
    >
    {theme.darkMode ? "Light Mode" : "Dark Mode"}
    </button>

    <button
      onClick={refetch}
      style={{
        padding: "8px 12px",
        marginBottom: "20px",
        background: "#2563eb",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer"
      }}
    >
      Refresh Data
    </button>
    <div style={{
      marginBottom: "15px",
      padding: "8px",
      background: "#dcfce7",
      color: "#166534",
      borderRadius: "6px",
      fontWeight: "bold"
    }}>
      🟢 Live Data (Auto Refreshing Every 5s)
    </div>
    <p style={{ fontSize: "14px", marginBottom: "10px" }}>
      Last updated: {lastUpdated?.toLocaleTimeString()}
    </p>


    {/* Metrics Grid */}
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "20px"
      }}
    >
      <MetricsCard
        title="Total Users"
        values={[data?.users?.total || 0]}
        icon="👥"
      />

      <MetricsCard
        title="Total Revenue"
        values={[data?.revenue?.total || 0]}
        icon="💰"
      />

      <MetricsCard
        title="Total Orders"
        values={[data?.orders?.total || 0]}     
        icon="📦"
      />
    </div>

    {/* Performance Section */}
    <div
      style={{
        marginTop: "40px",
        padding: "20px",
        background: theme.cardBg,
        color: theme.text,
        borderRadius: "8px"
      }}
    >
      <h3>Performance Metrics</h3>
      <p>Render Count: {perf.renders}</p>
      <p>Load Time: {perf.loadTime?.toFixed(2)} ms</p>
      <p>First Paint: {perf.firstPaint?.toFixed(2)} ms</p>
      <p>
        First Contentful Paint:{" "}
        {perf.firstContentfulPaint?.toFixed(2)} ms
      </p>
    </div>
  </div>
  );
}