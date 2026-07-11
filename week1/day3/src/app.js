/**
 * ============================================================
 * Main Application
 * ------------------------------------------------------------
 * This file connects all modules together.
 * Responsibilities:
 * 1. Create dashboard UI
 * 2. Initialize DataManager
 * 3. Initialize ChartManager
 * 4. Initialize PerformanceMonitor
 * ============================================================
 */

import { DataManager } from "./modules/DataManager.js";
import { ChartManager } from "./modules/ChartManager.js";
import { PerformanceMonitor } from "./modules/PerformanceMonitor.js";

class DashboardApp {

    constructor() {

        // API Base URL
        this.dataManager = new DataManager("/api");

        // Will hold ChartManager object
        this.chartManager = null;

        // Performance Monitor
        this.performanceMonitor = new PerformanceMonitor();

        // Start application
        this.init();

    }

    /**
     * Main initialization
     */
    async init() {

        try {

            // Create dashboard UI
            this.createDashboard();

            // Initialize charts
            this.initializeCharts();

            // Register button events
            this.setupEventListeners();

            // Start performance updates
            this.startPerformanceMonitoring();

        }

        catch (error) {

            console.error(error);

            this.showError("Application failed to start.");

        }

    }

    /**
     * Creates dashboard HTML
     */
    createDashboard() {

        document.querySelector(".content").innerHTML = `

        <div class="dashboard-container">

            <div class="charts-grid">

                <div class="chart-container">

                    <h3>Revenue</h3>

                    <canvas id="revenueChart"></canvas>

                </div>

                <div class="chart-container">

                    <h3>Users</h3>

                    <canvas id="userChart"></canvas>

                </div>

                <div class="chart-container">

                    <h3>Orders</h3>

                    <canvas id="orderChart"></canvas>

                </div>

                <div class="chart-container">

                    <h3>Performance</h3>

                    <canvas id="performanceChart"></canvas>

                </div>

            </div>

            <div class="performance-panel">

                <h2>Performance Metrics</h2>

                <div id="performance-metrics"></div>

            </div>

        </div>

        `;

    }

    /**
     * Initialize Chart Manager
     */
    initializeCharts() {

        this.chartManager = new ChartManager(

            "charts-grid",

            this.dataManager

        );

    }

    /**
     * Create buttons
     */
    setupEventListeners() {

        const header = document.querySelector(".content-header");

        // Refresh Button
        const refreshBtn = document.createElement("button");

        refreshBtn.textContent = "Refresh";

        refreshBtn.addEventListener("click", () => {

            this.refreshDashboard();

        });

        header.appendChild(refreshBtn);

        // Toggle Performance Button
        const performanceBtn = document.createElement("button");

        performanceBtn.textContent = "Performance";

        performanceBtn.addEventListener("click", () => {

            this.togglePerformancePanel();

        });

        header.appendChild(performanceBtn);

    }

    /**
     * Refresh dashboard
     */
    async refreshDashboard() {

        this.dataManager.clearCache();

        if (this.chartManager) {

            await this.chartManager.createCharts();

        }

    }

    /**
     * Hide / Show Performance Panel
     */
    togglePerformancePanel() {

        const panel = document.querySelector(".performance-panel");

        panel.style.display =

            panel.style.display === "none"

                ? "block"

                : "none";

    }

    /**
     * Listen for performance metrics
     */
    startPerformanceMonitoring() {

        this.performanceMonitor.subscribe(metric => {

            this.updatePerformance(metric);

        });

    }

    /**
     * Update Performance UI
     */
    updatePerformance(metric) {

        const container = document.getElementById("performance-metrics");

        if (!container) return;

        const div = document.createElement("div");

        div.innerHTML = `

            <strong>${metric.name}</strong>

            : ${metric.value}

        `;

        container.appendChild(div);

    }

    /**
     * Show Application Error
     */
    showError(message) {

        document.querySelector(".content").innerHTML = `

            <h2>${message}</h2>

        `;

    }

}

// Start Application
document.addEventListener("DOMContentLoaded", () => {

    new DashboardApp();

});