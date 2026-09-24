import { DataManager } from './modules/DataManager.js';
import { ChartManager } from './modules/ChartManager.js';
import { PerformanceMonitor } from './modules/PerformanceMonitor.js';

class DashboardApp {
    constructor() {
        this.dataManager = new DataManager('/api');
        this.chartManager = null;
        this.performanceMonitor = new PerformanceMonitor();
        this.isMonitoring = false;
    }

    async init() {
        try {
            this.setupUI();

            await this.initializeCharts();

            this.setupEventListeners();

            this.startPerformanceMonitoring();
        } catch (error) {
            console.error(
                'Dashboard initialization failed:',
                error
            );

            this.showError(error);
        }
    }

    setupUI() {
        const app = document.getElementById('app');

        app.innerHTML = `
            <header class="dashboard-header">
                <div>
                    <p class="eyebrow">Day 3</p>

                    <h1>
                        Advanced JavaScript Dashboard
                    </h1>

                    <p class="subtitle">
                        ES6 modules, Chart.js and performance monitoring
                    </p>
                </div>

                <div class="header-actions">
                    <button
                        id="refresh-btn"
                        class="btn primary"
                        type="button"
                    >
                        Refresh Data
                    </button>

                    <button
                        id="monitor-btn"
                        class="btn secondary"
                        type="button"
                    >
                        Stop Monitoring
                    </button>
                </div>
            </header>

            <main>
                <section class="stats-grid">
                    <article class="stat-card">
                        <span class="stat-label">
                            Architecture
                        </span>

                        <strong>
                            ES6 Modules
                        </strong>
                    </article>

                    <article class="stat-card">
                        <span class="stat-label">
                            Visualization
                        </span>

                        <strong>
                            Chart.js
                        </strong>
                    </article>

                    <article class="stat-card">
                        <span class="stat-label">
                            Async Operations
                        </span>

                        <strong>
                            Promise.all()
                        </strong>
                    </article>

                    <article class="stat-card">
                        <span class="stat-label">
                            Monitoring
                        </span>

                        <strong>
                            Web Vitals
                        </strong>
                    </article>
                </section>

                <section
                    id="charts-grid"
                    class="charts-grid"
                    aria-label="Dashboard charts"
                >
                    <div class="loading">
                        Loading charts...
                    </div>
                </section>

                <section
                    class="performance-section"
                    aria-labelledby="performance-heading"
                >
                    <div class="section-heading">
                        <div>
                            <p class="eyebrow">
                                Performance
                            </p>

                            <h2 id="performance-heading">
                                Live Performance Metrics
                            </h2>
                        </div>
                    </div>

                    <div
                        id="performance-panel"
                        class="performance-panel"
                        aria-live="polite"
                    >
                        <p class="loading">
                            Starting performance monitoring...
                        </p>
                    </div>
                </section>
            </main>

            <footer class="dashboard-footer">
                <p>
                    Day 3: JavaScript Advanced — Modular Dashboard
                </p>
            </footer>
        `;
    }

    async initializeCharts() {
        this.chartManager = new ChartManager(
            'charts-grid',
            this.dataManager
        );

        await this.chartManager.init();
    }

    setupEventListeners() {
        const refreshButton =
            document.getElementById('refresh-btn');

        const monitorButton =
            document.getElementById('monitor-btn');

        refreshButton.addEventListener(
            'click',
            async () => {
                await this.refreshData();
            }
        );

        monitorButton.addEventListener(
            'click',
            () => {
                this.togglePerformanceMonitoring();
            }
        );
    }

    async refreshData() {
        try {
            const refreshButton =
                document.getElementById('refresh-btn');

            refreshButton.disabled = true;
            refreshButton.textContent = 'Refreshing...';

            this.dataManager.clearCache();

            await this.chartManager.createCharts();
        } catch (error) {
            console.error(
                'Data refresh failed:',
                error
            );

            this.showError(error);
        } finally {
            const refreshButton =
                document.getElementById('refresh-btn');

            refreshButton.disabled = false;
            refreshButton.textContent = 'Refresh Data';
        }
    }

    startPerformanceMonitoring() {
        this.isMonitoring = true;

        this.performanceMonitor.startMonitoring();

        this.performanceMonitor.subscribe(
            (name, metric) => {
                this.updatePerformanceDisplay(
                    name,
                    metric
                );
            }
        );

        this.updatePerformanceDisplay();
    }

    togglePerformanceMonitoring() {
        const monitorButton =
            document.getElementById('monitor-btn');

        if (this.isMonitoring) {
            this.performanceMonitor.stopMonitoring();

            this.isMonitoring = false;
            monitorButton.textContent =
                'Start Monitoring';
        } else {
            this.performanceMonitor.startMonitoring();

            this.isMonitoring = true;
            monitorButton.textContent =
                'Stop Monitoring';
        }
    }

    updatePerformanceDisplay() {
        const panel =
            document.getElementById(
                'performance-panel'
            );

        if (!panel) {
            return;
        }

        const metrics =
            this.performanceMonitor.getAllMetrics();

        const entries =
            Object.entries(metrics).slice(-10);

        if (!entries.length) {
            panel.innerHTML = `
                <p class="empty-state">
                    Waiting for performance metrics...
                </p>
            `;

            return;
        }

        panel.innerHTML = entries
            .map(([name, metric]) => {
                let value = metric.value;

                if (
                    typeof value === 'object' &&
                    value !== null
                ) {
                    value = JSON.stringify(value);
                } else if (
                    typeof value === 'number'
                ) {
                    value = value.toFixed(2);
                }

                return `
                    <div
                        class="metric-row"
                        role="status"
                    >
                        <span>${name}</span>

                        <strong>
                            ${value}
                        </strong>
                    </div>
                `;
            })
            .join('');
    }

    showError(error) {
        const app =
            document.getElementById('app');

        if (!app) {
            return;
        }

        const existingError =
            document.querySelector(
                '.global-error'
            );

        if (existingError) {
            existingError.remove();
        }

        const errorElement =
            document.createElement('div');

        errorElement.className =
            'global-error';

        errorElement.setAttribute(
            'role',
            'alert'
        );

        errorElement.innerHTML = `
            <strong>
                Something went wrong
            </strong>

            <span>
                ${error.message}
            </span>
        `;

        app.prepend(errorElement);
    }
}

document.addEventListener(
    'DOMContentLoaded',
    () => {
        const app = new DashboardApp();

        app.init();
    }
);