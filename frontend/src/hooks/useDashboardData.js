import { useEffect, useState } from "react";
import dashboardService from "../services/DashboardService";
import { generateDashboardData } from "../utils/dashboardData";
function useDashboardData() {
    const dashboard = generateDashboardData(users.length);

    setMetrics(dashboard);
    const [metrics, setMetrics] = useState({
        users: 0,
        revenue: 0,
        orders: 0,
    });

    useEffect(() => {
        async function loadData() {
            try {
                const users = await dashboardService.fetchData("/users");


            } catch (error) {
                console.error(error);
            }
        }

        loadData();
    }, []);

    return metrics;
}

export default useDashboardData;