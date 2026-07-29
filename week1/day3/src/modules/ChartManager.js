/**
 * ============================================================
 * ChartManager
 * ------------------------------------------------------------
 * Responsibilities:
 * 1. Load Chart.js
 * 2. Create charts
 * 3. Update charts
 * 4. Listen for DataManager updates
 * ============================================================
 */

export class ChartManager {

    constructor(containerId, dataManager) {

        this.container = document.getElementById(containerId);

        this.dataManager = dataManager;

        // Stores all created charts
        this.charts = new Map();

        this.init();

    }

    /**
     * Start Chart Manager
     */
    async init() {

        await this.loadChartLibrary();

        this.createCharts();

        this.setupEventListeners();

    }

    /**
     * Dynamically load Chart.js CDN
     */
    loadChartLibrary() {

        return new Promise((resolve, reject) => {

            if (window.Chart) {
                resolve();
                return;
            }

            const script = document.createElement("script");

            script.src = "https://cdn.jsdelivr.net/npm/chart.js";

            script.onload = resolve;

            script.onerror = reject;

            document.head.appendChild(script);

        });

    }

    /**
     * Create all dashboard charts
     */
    createCharts() {

        // Mock Data
        const revenue = [120, 150, 180, 170, 220, 250];

        const users = [20, 35, 40, 60, 75, 95];

        const orders = [30, 25, 20, 25];

        const months = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun"
        ];

        this.createLineChart(
            "revenueChart",
            months,
            revenue
        );

        this.createBarChart(
            "userChart",
            months,
            users
        );

        this.createDoughnutChart(
            "orderChart",
            ["Online", "Store", "App", "Others"],
            orders
        );

        this.createMixedChart(
            "performanceChart",
            months,
            users,
            revenue
        );

    }

    /**
     * Revenue Chart
     */
    createLineChart(id, labels, values) {

        const ctx = document.getElementById(id);

        this.charts.set(id, new Chart(ctx, {

            type: "line",

            data: {

                labels,

                datasets: [

                    {

                        label: "Revenue",

                        data: values,

                        borderWidth: 3,

                        fill: true

                    }

                ]

            }

        }));

    }

    /**
     * Users Chart
     */
    createBarChart(id, labels, values) {

        const ctx = document.getElementById(id);

        this.charts.set(id, new Chart(ctx, {

            type: "bar",

            data: {

                labels,

                datasets: [

                    {

                        label: "Users",

                        data: values

                    }

                ]

            }

        }));

    }

    /**
     * Orders Chart
     */
    createDoughnutChart(id, labels, values) {

        const ctx = document.getElementById(id);

        this.charts.set(id, new Chart(ctx, {

            type: "doughnut",

            data: {

                labels,

                datasets: [

                    {

                        data: values

                    }

                ]

            }

        }));

    }

    /**
     * Mixed Chart
     */
    createMixedChart(id, labels, users, revenue) {

        const ctx = document.getElementById(id);

        this.charts.set(id, new Chart(ctx, {

            data: {

                labels,

                datasets: [

                    {

                        type: "bar",

                        label: "Users",

                        data: users

                    },

                    {

                        type: "line",

                        label: "Revenue",

                        data: revenue

                    }

                ]

            }

        }));

    }

    /**
     * Listen for DataManager updates
     */
    setupEventListeners() {

        this.dataManager.subscribe((endpoint, data) => {

            console.log("Chart Updated :", endpoint);

        });

        window.addEventListener("resize", () => {

            this.charts.forEach(chart => chart.resize());

        });

    }

}