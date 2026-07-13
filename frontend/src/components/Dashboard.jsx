import Sidebar from "./Sidebar";
import Footer from "./Footer";
import DashboardHeader from "./DashboardHeader";
import MetricsGrid from "./MetricsGrid";
import ChartContainer from "./ChartContainer";
import PerformanceMonitor from "./PerformanceMonitor";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";
import ConnectionStatus from "./ConnectionStatus";

import { useData } from "../contexts/DataContext";
import { useRealTimeData } from "../hooks/useRealTimeData";

function Dashboard() {
  const {
    metrics,
    loading,
    error,
  } = useData();

  // Initialize WebSocket real-time updates
  useRealTimeData();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="dashboard">
      <DashboardHeader />

      <ConnectionStatus />

      <div className="main">
        <Sidebar />

        <section className="content">
          <div className="content-header">
            <h2>Dashboard Overview</h2>

            <p>
              Monitor your application's users,
              revenue, orders and overall
              performance in real time.
            </p>
          </div>

          <MetricsGrid metrics={metrics} />

          <ChartContainer />

          <PerformanceMonitor />
        </section>
      </div>

      <Footer />
    </div>
  );
}

export default Dashboard;