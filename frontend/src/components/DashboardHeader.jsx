import { useCallback } from "react";
import dashboardService from "../services/DashboardService";
import { generateDashboardData } from "../utils/dashboardData";
import { useData } from "../contexts/DataContext";

function DashboardHeader() {

    const {
        setMetrics,
        setLoading,
        setError,
    } = useData();

    const refreshDashboard = useCallback(async () => {

        try {

            setLoading(true);

            dashboardService.clearCache();

            const users = await dashboardService.fetchData("/users");

            const dashboard = generateDashboardData(users.length);

            setMetrics(dashboard);

        } catch (err) {

            setError(err.message);

        } finally {

            setLoading(false);

        }

    }, [setMetrics, setLoading, setError]);

    return (

        <header className="header">

            <nav className="nav">

                <div className="nav-brand">

                    <h1>📊 Mechlin Dashboard</h1>

                </div>

                <ul className="nav-menu">

                    <li><a href="#home">Home</a></li>

                    <li><a href="#analytics">Analytics</a></li>

                    <li><a href="#settings">Settings</a></li>

                </ul>

                <button
                    onClick={refreshDashboard}
                    className="refresh-btn"
                >
                    🔄 Refresh Dashboard
                </button>

            </nav>

        </header>

    );

}

export default DashboardHeader;