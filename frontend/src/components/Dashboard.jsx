import { useEffect } from "react";

import Sidebar from "./Sidebar";
import Footer from "./Footer";
import DashboardHeader from "./DashboardHeader";
import MetricsGrid from "./MetricsGrid";
import ChartContainer from "./ChartContainer";
import PerformanceMonitor from "./PerformanceMonitor";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";

import dashboardService from "../services/DashboardService";
import { useData } from "../contexts/DataContext";

function Dashboard() {

  const {
    metrics,
    setMetrics,
    loading,
    setLoading,
    error,
    setError,
  } = useData();

  useEffect(() => {

    async function loadDashboard() {

      try {

        setLoading(true);

        const users = await dashboardService.fetchData("/users");

        setMetrics({

          users: users.length,
        
          revenue: Math.floor(Math.random() * 100000),
        
          orders: Math.floor(Math.random() * 1000),
          growthRate: 18.4,
        
          months: ["Jan","Feb","Mar","Apr","May","Jun"],
        
          revenueHistory: [
            12000,
            18000,
            22000,
            26000,
            31000,
            40000
          ]
        
        });

      } catch (err) {

        setError(err.message);

      } finally {

        setLoading(false);

      }

    }

    loadDashboard();

  }, [setMetrics, setLoading, setError]);

  if (loading) {

    return <LoadingSpinner />;

  }

  if (error) {

    return <ErrorMessage message={error} />;

  }

  return (

    <div className="dashboard">

      <DashboardHeader
        metrics={metrics}
        setMetrics={setMetrics}
      />

      <div className="main">

        <Sidebar />

        <section className="content">

          <div className="content-header">

            <h2>Dashboard Overview</h2>

            <p>
            Monitor your application's users, revenue,
            orders and overall performance in real time.
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