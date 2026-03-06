import { DataManager } from './DataManager.js';

export class ChartManager {
    constructor(containerId, dataManager) {
        this.container = document.getElementById(containerId);
        this.dataManager = dataManager;
        this.charts = new Map();
        this.init();
    }

    async init() {
        try {
            await this.loadChartLibrary();
            this.setupEventListeners();
            await this.createCharts();
        } catch (error) {
            this.showError('Failed to initialize charts: ' + error.message);
        }
    }

    async loadChartLibrary() {
        if (window.Chart) return Promise.resolve(); // Prevent duplicate loading

        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
            script.onload = resolve;
            script.onerror = () => reject(new Error('Failed to load Chart.js'));
            document.head.appendChild(script);
        });
    }

    async createCharts() {
        try {
            // Fetch data concurrently
            const [userData, revenueData, orderData] = await Promise.all([
                this.dataManager.fetchData('/users'),
                this.dataManager.fetchData('/revenue'),
                this.dataManager.fetchData('/orders')
            ]);

            // Allow aborted network requests to drop safely
            if (!userData || !revenueData || !orderData) return;

            this.createLineChart('revenueChart', revenueData);
            this.createBarChart('userChart', userData);
            this.createDoughnutChart('orderChart', orderData);
            this.createMixedChart('performanceChart', { userData, revenueData, orderData });

        } catch (error) {
            console.error('Chart creation error:', error);
            this.showError('Failed to load chart data');
        }
    }

    registerChart(canvasId, config) {
        // Destroy existing instance to prevent Canvas memory leaks
        if (this.charts.has(canvasId)) {
            this.charts.get(canvasId).destroy();
        }

        const canvas = document.getElementById(canvasId);
        if (!canvas) return; // Silent fail if DOM absent

        const ctx = canvas.getContext('2d');
        const newChart = new window.Chart(ctx, config);
        this.charts.set(canvasId, newChart);
    }

    createLineChart(canvasId, data) {
        this.registerChart(canvasId, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Revenue',
                    data: data.values,
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
    }

    createBarChart(canvasId, data) {
        this.registerChart(canvasId, {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Users',
                    data: data.values,
                    backgroundColor: 'rgba(16, 185, 129, 0.8)'
                }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
    }

    createDoughnutChart(canvasId, data) {
        this.registerChart(canvasId, {
            type: 'doughnut',
            data: {
                labels: data.labels,
                datasets: [{
                    data: data.values,
                    backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444']
                }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
    }

    createMixedChart(canvasId, data) {
        this.registerChart(canvasId, {
            type: 'line',
            data: {
                labels: data.userData.labels,
                datasets: [
                    {
                        label: 'Users',
                        data: data.userData.values,
                        type: 'bar',
                        backgroundColor: 'rgba(59, 130, 246, 0.6)',
                        yAxisID: 'y'
                    },
                    {
                        label: 'Revenue',
                        data: data.revenueData.values,
                        type: 'line',
                        borderColor: 'rgb(16, 185, 129)',
                        tension: 0.4,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
    }

    setupEventListeners() {
        this.dataManager.subscribe((endpoint, data) => {
            this.updateCharts(endpoint, data);
        });

        window.addEventListener('resize', this.debounce(() => {
            this.charts.forEach(chart => chart.resize());
        }, 250));
    }

    updateCharts(endpoint, data) {
        const idMap = {
            '/users': 'userChart',
            '/revenue': 'revenueChart',
            '/orders': 'orderChart'
        };
        const chartId = idMap[endpoint];
        if (chartId && this.charts.has(chartId)) {
            const chart = this.charts.get(chartId);
            chart.data.labels = data.labels;
            // Assuming single dataset updates for brevity
            chart.data.datasets[0].data = data.values;
            chart.update('active');
        }
    }

    showError(message) {
        if (!this.container) return;
        this.container.innerHTML = `
            <div class="error-message">
                <h3>Error</h3>
                <p>${message}</p>
                <button onclick="location.reload()">Retry</button>
            </div>
        `;
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}
