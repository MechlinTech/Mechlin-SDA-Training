import { DataManager } from './modules/DataManager.js';
import { ChartManager } from './modules/ChartManager.js';
import { PerformanceMonitor } from './modules/PerformanceMonitor.js';

class DashboardApp {
    constructor() {
        this.dataManager = new DataManager('/api');
        this.chartManager = null;
        this.performanceMonitor = new PerformanceMonitor();
        this.init();
    }

    async init() {
        try {
            this.setupUI();
            this.showLoadingState(true);
            await this.initializeCharts();
            this.setupEventListeners();
            this.startPerformanceMonitoring();
        } catch (error) {
            console.error('App initialization error:', error);
            this.showError('Critical Failure: Unable to bootstrap dashboard interface.');
        } finally {
            this.showLoadingState(false);
        }
    }

    setupUI() {
        // Since we are moving to Day 2's shell, we ONLY dynamically inject the charts now, instead of the whole page.
        const chartsHTML = `
            <div class="chart-container">
                <h3>Revenue Trend</h3>
                <canvas id="revenueChart"></canvas>
            </div>
            <div class="chart-container">
                <h3>User Growth</h3>
                <canvas id="userChart"></canvas>
            </div>
            <div class="chart-container">
                <h3>Order Distribution</h3>
                <canvas id="orderChart"></canvas>
            </div>
            <div class="chart-container">
                <h3>Performance Overview</h3>
                <canvas id="performanceChart"></canvas>
            </div>
        `;

        const chartsSection = document.querySelector('.charts-section');
        if (chartsSection) {
            chartsSection.innerHTML = chartsHTML;
        }
    }

    showLoadingState(isLoading) {
        const loader = document.getElementById('loadingOverlay');
        if (loader) loader.style.display = isLoading ? 'flex' : 'none';
    }

    async initializeCharts() {
        this.chartManager = new ChartManager('charts-section', this.dataManager);
    }

    setupEventListeners() {
        const refreshBtn = document.createElement('button');
        refreshBtn.textContent = 'Refresh Data';
        refreshBtn.className = 'refresh-btn';
        refreshBtn.addEventListener('click', () => this.refreshData());

        const monitorBtn = document.createElement('button');
        monitorBtn.textContent = 'Toggle Monitor';
        monitorBtn.className = 'monitor-btn';
        monitorBtn.addEventListener('click', () => this.togglePerformanceMonitor());

        // Header append logic updated for Day 2 layout container
        const actionsHeader = document.querySelector('.content-header-actions');
        if (actionsHeader) {
            actionsHeader.appendChild(refreshBtn);
            actionsHeader.appendChild(monitorBtn);
        }
    }

    async refreshData() {
        this.showLoadingState(true);
        this.dataManager.clearCache();
        await this.chartManager.createCharts();
        this.showLoadingState(false);
    }

    togglePerformanceMonitor() {
        const panel = document.querySelector('.performance-panel');
        if (panel) panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    }

    startPerformanceMonitoring() {
        this.performanceMonitor.subscribe((metric) => {
            const container = document.getElementById('performance-metrics');
            if (!container) return;

            const metricElement = document.createElement('div');
            metricElement.className = 'metric-item';
            metricElement.innerHTML = `
                <span class="metric-name">${metric.name}:</span>
                <span class="metric-value">${metric.value.toFixed(2)}</span>
            `;

            container.insertBefore(metricElement, container.firstChild);

            if (container.children.length > 8) {
                container.lastChild.remove();
            }
        });
    }

    showError(message) {
        const chartsSection = document.querySelector('.charts-section') || document.body;
        chartsSection.innerHTML = `
            <div class="error-container">
                <h2>System Error</h2>
                <p>${message}</p>
                <button onclick="location.reload()">Reload Application</button>
            </div>
        `;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new DashboardApp();
});
