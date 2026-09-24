import { DataManager } from './DataManager.js';

export class ChartManager {
    constructor(containerId, dataManager) {
        this.containerId = containerId;
        this.dataManager = dataManager;
        this.charts = new Map();
        this.chartLibrary = null;
    }

    async init() {
        try {
            await this.loadChartLibrary();
            await this.createCharts();
            this.setupSubscriptions();
            this.setupResizeHandler();
        } catch (error) {
            console.error(
                'ChartManager initialization failed:',
                error
            );

            this.showError(error);
        }
    }

    async loadChartLibrary() {
        if (window.Chart) {
            this.chartLibrary = window.Chart;
            return;
        }

        await new Promise((resolve, reject) => {
            const script =
                document.createElement('script');

            script.src =
                'https://cdn.jsdelivr.net/npm/chart.js';

            script.onload = resolve;

            script.onerror = () => {
                reject(
                    new Error(
                        'Failed to load Chart.js'
                    )
                );
            };

            document.head.appendChild(script);
        });

        this.chartLibrary = window.Chart;
    }

    async createCharts() {
        const container =
            document.getElementById(
                this.containerId
            );

        if (!container) {
            throw new Error(
                `Container #${this.containerId} not found`
            );
        }

        container.innerHTML = `
            <div class="chart-card">
                <h2>User Growth</h2>

                <canvas
                    id="users-chart"
                    aria-label="User growth chart"
                    role="img"
                ></canvas>
            </div>

            <div class="chart-card">
                <h2>Revenue</h2>

                <canvas
                    id="revenue-chart"
                    aria-label="Revenue chart"
                    role="img"
                ></canvas>
            </div>

            <div class="chart-card">
                <h2>Orders</h2>

                <canvas
                    id="orders-chart"
                    aria-label="Orders chart"
                    role="img"
                ></canvas>
            </div>

            <div class="chart-card">
                <h2>Performance Overview</h2>

                <canvas
                    id="performance-chart"
                    aria-label="Performance overview chart"
                    role="img"
                ></canvas>
            </div>
        `;

        try {
            const [
                users,
                revenue,
                orders
            ] = await Promise.all([
                this.dataManager.fetchData(
                    '/users'
                ),

                this.dataManager.fetchData(
                    '/revenue'
                ),

                this.dataManager.fetchData(
                    '/orders'
                )
            ]);

            this.createUserChart(users);
            this.createRevenueChart(revenue);
            this.createOrdersChart(orders);
            this.createPerformanceChart(
                users,
                revenue,
                orders
            );
        } catch (error) {
            console.error(
                'Failed to create charts:',
                error
            );

            throw error;
        }
    }

    createUserChart(data) {
        const ctx =
            document.getElementById(
                'users-chart'
            );

        const chart =
            new this.chartLibrary(
                ctx,
                {
                    type: 'line',

                    data: {
                        labels: data.labels,

                        datasets: [
                            {
                                label: 'Users',
                                data: data.values,
                                tension: 0.4,
                                fill: true
                            }
                        ]
                    },

                    options:
                        this.getChartOptions()
                }
            );

        this.charts.set(
            'users',
            chart
        );
    }

    createRevenueChart(data) {
        const ctx =
            document.getElementById(
                'revenue-chart'
            );

        const chart =
            new this.chartLibrary(
                ctx,
                {
                    type: 'bar',

                    data: {
                        labels: data.labels,

                        datasets: [
                            {
                                label: 'Revenue',
                                data: data.values
                            }
                        ]
                    },

                    options:
                        this.getChartOptions()
                }
            );

        this.charts.set(
            'revenue',
            chart
        );
    }

    createOrdersChart(data) {
        const ctx =
            document.getElementById(
                'orders-chart'
            );

        const chart =
            new this.chartLibrary(
                ctx,
                {
                    type: 'doughnut',

                    data: {
                        labels: data.labels,

                        datasets: [
                            {
                                label: 'Orders',
                                data: data.values
                            }
                        ]
                    },

                    options:
                        this.getChartOptions()
                }
            );

        this.charts.set(
            'orders',
            chart
        );
    }

    createPerformanceChart(
        users,
        revenue,
        orders
    ) {
        const ctx =
            document.getElementById(
                'performance-chart'
            );

        const chart =
            new this.chartLibrary(
                ctx,
                {
                    type: 'bar',

                    data: {
                        labels:
                            revenue.labels,

                        datasets: [
                            {
                                type: 'bar',
                                label: 'Revenue',
                                data:
                                    revenue.values
                            },

                            {
                                type: 'line',
                                label: 'Users',
                                data:
                                    users.values,
                                tension: 0.4
                            }
                        ]
                    },

                    options:
                        this.getChartOptions()
                }
            );

        this.charts.set(
            'performance',
            chart
        );
    }

    getChartOptions() {
        return {
            responsive: true,
            maintainAspectRatio: false,

            animation: {
                duration: 800
            },

            plugins: {
                legend: {
                    display: true
                }
            }
        };
    }

    setupSubscriptions() {
        this.dataManager.subscribe(
            (endpoint, data) => {
                this.updateChart(
                    endpoint,
                    data
                );
            }
        );
    }

    updateChart(endpoint, data) {
        let chartName;

        if (endpoint === '/users') {
            chartName = 'users';
        } else if (
            endpoint === '/revenue'
        ) {
            chartName = 'revenue';
        } else if (
            endpoint === '/orders'
        ) {
            chartName = 'orders';
        }

        if (!chartName) {
            return;
        }

        const chart =
            this.charts.get(chartName);

        if (!chart) {
            return;
        }

        chart.data.labels =
            data.labels;

        chart.data.datasets[0].data =
            data.values;

        chart.update();
    }

    setupResizeHandler() {
        const debouncedResize =
            this.debounce(
                () => {
                    this.charts.forEach(
                        chart => {
                            chart.resize();
                        }
                    );
                },
                250
            );

        window.addEventListener(
            'resize',
            debouncedResize
        );
    }

    debounce(func, delay) {
        let timeout;

        return (...args) => {
            clearTimeout(timeout);

            timeout = setTimeout(
                () => {
                    func(...args);
                },
                delay
            );
        };
    }

    showError(error) {
        const container =
            document.getElementById(
                this.containerId
            );

        if (!container) {
            return;
        }

        container.innerHTML = `
            <div
                class="error-message"
                role="alert"
            >
                <h2>
                    Unable to load charts
                </h2>

                <p>
                    ${error.message}
                </p>
            </div>
        `;
    }
}