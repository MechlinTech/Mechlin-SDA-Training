# Day 3: JavaScript Advanced

## 🎯 Learning Objectives

- Master ES6+ features: arrow functions, destructuring, modules, async/await
- Implement advanced JavaScript patterns and design principles
- Build dynamic data visualization with Chart.js or D3.js
- Optimize DOM manipulation and performance
- Create reusable JavaScript modules and components

## 📚 Theory & Concepts

### ES6+ Features
- **Arrow Functions**: Concise syntax, lexical `this` binding
- **Destructuring**: Object and array destructuring, default values
- **Template Literals**: String interpolation, tagged templates
- **Modules**: Import/export, dynamic imports, tree shaking
- **Async/Await**: Promise handling, error management, concurrent operations

### Advanced JavaScript Patterns
- **Closures**: Function scope, private variables, module pattern
- **Prototypes**: Object inheritance, prototype chain, ES6 classes
- **Event Handling**: Event delegation, custom events, performance optimization
- **Memory Management**: Garbage collection, memory leaks, performance profiling

### Data Visualization
- **Chart.js**: Canvas-based charts, responsive design, animations
- **D3.js**: Data-driven documents, SVG manipulation, custom visualizations
- **Performance**: Canvas vs SVG, data processing, rendering optimization

## 🛠️ Hands-on Tasks

### Task 1: Create Advanced JavaScript Module System

**Why do this?**
A well-structured module system is essential for scalability. Using ES6 classes and modules keeps the global namespace clean and encourages reusable, testable code.

**The Better Way (Best Practices Applied):**
- **AbortController**: Prevents race conditions on rapid, consecutive API calls by terminating previous requests.
- **Cache TTL (Time-to-Live)**: Storing data indefinitely causes memory leaks and stale data. Adding an expiration mechanism ensures freshness.
- **Robust Error Handling**: Distinctly managing HTTP errors vs. network failures.

```javascript
// src/modules/DataManager.js
export class DataManager {
    constructor(apiUrl, cacheTTL = 5 * 60 * 1000) { // Default 5 mins TTL
        this.apiUrl = apiUrl;
        this.cache = new Map();
        this.subscribers = new Set();
        this.activeRequests = new Map(); // Track ongoing requests to allow cancellation
        this.cacheTTL = cacheTTL;
    }
    
    async fetchData(endpoint, options = {}) {
        const cacheKey = `${endpoint}-${JSON.stringify(options)}`;
        
        // 1. Check valid cache
        if (this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.cacheTTL) {
                return cached.data;
            }
            this.cache.delete(cacheKey); // Evict stale cache
        }
        
        // 2. Cancel duplicate in-flight requests
        if (this.activeRequests.has(cacheKey)) {
            this.activeRequests.get(cacheKey).abort();
        }
        
        const controller = new AbortController();
        this.activeRequests.set(cacheKey, controller);
        
        try {
            const response = await fetch(`${this.apiUrl}${endpoint}`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                signal: controller.signal,
                ...options
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // 3. Cache the result with a timestamp
            this.cache.set(cacheKey, { timestamp: Date.now(), data });
            
            this.notifySubscribers(endpoint, data);
            return data;
        } catch (error) {
            if (error.name === 'AbortError') {
                console.log(`Fetch aborted for ${endpoint}`);
                return null;
            }
            console.error('Data fetch error:', error);
            throw error;
        } finally {
            this.activeRequests.delete(cacheKey);
        }
    }
    
    subscribe(callback) {
        this.subscribers.add(callback);
        // Return an unsubscribe function
        return () => this.subscribers.delete(callback);
    }
    
    notifySubscribers(endpoint, data) {
        this.subscribers.forEach(callback => callback(endpoint, data));
    }
    
    clearCache() {
        this.cache.clear();
    }
}
```

### Task 2: Implement Data Visualization Dashboard

**Why do this?**
Data visualization bridges the gap between raw data and actionable user insights. Chart.js is widely used because it leverages the HTML5 Canvas API for highly performant rendering of complex data sequences.

**The Better Way (Best Practices Applied):**
- **Duplicate Script Avoidance**: By dynamically creating a script tag, we could accidentally mount `chart.js` multiple times. We now check the global object or existing tags.
- **Memory Cleanup**: Canvas contexts memory leaks easily. We must call `chart.destroy()` before re-rendering a chart.
- **Graceful Fault Tolerance**: Provide visual feedback when chart data fails to load, instead of quietly failing in the console.

```javascript
// src/modules/ChartManager.js
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
                this.dataManager.fetchData('/api/users'),
                this.dataManager.fetchData('/api/revenue'),
                this.dataManager.fetchData('/api/orders')
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
        
        const ctx = document.getElementById(canvasId).getContext('2d');
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
            '/api/users': 'userChart',
            '/api/revenue': 'revenueChart',
            '/api/orders': 'orderChart'
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
```

### Task 3: Create Performance Monitoring

**Why do this?**
Frontend code can dramatically inflate memory footprints or cause sluggish paints, souring the UX. Leveraging browser APIs (like `PerformanceObserver`) provides empirical diagnostics rather than qualitative guesses.

**The Better Way (Best Practices Applied):**
- **Safety checks on Storage**: `localStorage` has strict quotas and might be disabled (Safari private mode). Wrapping storage operations in `try/catch` prevents hard crashes.
- **Unsubscribing / Passive listeners**: Event listeners attached for scroll and touch must use `{ passive: true }` to keep scrolling jank-free.

```javascript
// src/modules/PerformanceMonitor.js
export class PerformanceMonitor {
    constructor() {
        this.metrics = new Map();
        this.observers = new Set();
        this.init();
    }
    
    init() {
        this.observePerformance();
        this.observeMemory();
        this.observeUserInteractions();
    }
    
    observePerformance() {
        if (!('PerformanceObserver' in window)) return;

        try {
            const recordIfValid = (name) => (list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                if (lastEntry) this.recordMetric(name, lastEntry.startTime || lastEntry.processingStart || lastEntry.value);
            };

            // LCP
            new PerformanceObserver(recordIfValid('LCP')).observe({ entryTypes: ['largest-contentful-paint'] });
            
            // FID
            new PerformanceObserver((list) => {
                list.getEntries().forEach(entry => this.recordMetric('FID', entry.processingStart - entry.startTime));
            }).observe({ entryTypes: ['first-input'] });
            
            // CLS
            new PerformanceObserver((list) => {
                list.getEntries().forEach(entry => {
                    if (!entry.hadRecentInput) this.recordMetric('CLS', entry.value);
                });
            }).observe({ entryTypes: ['layout-shift'] });
        } catch (e) {
            console.warn('Performance APIs not fully supported or restricted.', e);
        }
    }
    
    observeMemory() {
        if ('memory' in performance) {
            setInterval(() => {
                const memory = performance.memory;
                this.recordMetric('memory-used', memory.usedJSHeapSize);
            }, 5000); // Polling every 5s
        }
    }
    
    observeUserInteractions() {
        let interactionCount = 0;
        
        // Passive listeners prevent scroll blocking on mobile
        ['click', 'keydown', 'scroll', 'touchstart'].forEach(eventType => {
            document.addEventListener(eventType, () => {
                interactionCount++;
                this.recordMetric('interaction-count', interactionCount);
            }, { passive: true });
        });
    }
    
    recordMetric(name, value) {
        const metric = { name, value, timestamp: Date.now() };
        this.metrics.set(name, metric);
        this.notifyObservers(metric);
        this.storeMetric(metric);
    }
    
    subscribe(callback) {
        this.observers.add(callback);
        return () => this.observers.delete(callback);
    }
    
    notifyObservers(metric) {
        this.observers.forEach(callback => callback(metric));
    }
    
    storeMetric(metric) {
        try {
            const stored = JSON.parse(localStorage.getItem('performance-metrics') || '[]');
            stored.push(metric);
            
            // Cap to last 100 entries to spare quota
            if (stored.length > 100) {
                stored.splice(0, stored.length - 100);
            }
            
            localStorage.setItem('performance-metrics', JSON.stringify(stored));
        } catch (e) {
            console.warn('Storage quota exceeded or unavailable. Cannot store metrics locally.');
        }
    }
    
    getStoredMetrics() {
        try {
            return JSON.parse(localStorage.getItem('performance-metrics') || '[]');
        } catch {
            return [];
        }
    }
}
```

### Task 4: Create Main Application

**Why do this?**
Applications aren't just collections of isolated modules. An entry module orchestrates the wiring of dependencies, error boundaries, and loading states, acting as the master controller of our system footprint.

**The Better Way (Best Practices Applied):**
- **Loading states**: Ensure the UI communicates that fetches are occurring.
- **Global Error Boundaries**: Catch sweeping initialization errors instead of halting on a blank screen.

```javascript
// src/app.js
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
        const dashboardHTML = `
            <div class="dashboard-container">
                <div id="loadingOverlay" style="display:none;" class="loading-overlay">Loading...</div>
                <div class="charts-grid">
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
                </div>
                <div class="performance-panel" style="display: none;">
                    <h3>Performance Metrics</h3>
                    <div id="performance-metrics"></div>
                </div>
            </div>
        `;
        
        // Ensure a .content div exists in your index.html
        const contentDiv = document.querySelector('.content') || document.body;
        contentDiv.innerHTML = dashboardHTML;
    }

    showLoadingState(isLoading) {
        const loader = document.getElementById('loadingOverlay');
        if (loader) loader.style.display = isLoading ? 'flex' : 'none';
    }
    
    async initializeCharts() {
        this.chartManager = new ChartManager('charts-grid', this.dataManager);
        // We wait for initial chart initialization
        // Notice DataManager would hit dummy /api paths without a server. 
        // Real implementations will fetch data here.
    }
    
    setupEventListeners() {
        const refreshBtn = document.createElement('button');
        refreshBtn.textContent = 'Refresh Data';
        refreshBtn.className = 'refresh-btn';
        refreshBtn.addEventListener('click', () => this.refreshData());
        
        const monitorBtn = document.createElement('button');
        monitorBtn.textContent = 'Toggle Performance Monitor';
        monitorBtn.className = 'monitor-btn';
        monitorBtn.addEventListener('click', () => this.togglePerformanceMonitor());

        // Header append
        const header = document.querySelector('.content-header') || document.body;
        header.appendChild(refreshBtn);
        header.appendChild(monitorBtn);
    }
    
    async refreshData() {
        this.showLoadingState(true);
        this.dataManager.clearCache();
        await this.chartManager.createCharts();
        this.showLoadingState(false);
    }
    
    togglePerformanceMonitor() {
        const panel = document.querySelector('.performance-panel');
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
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
        const contentDiv = document.querySelector('.content') || document.body;
        contentDiv.innerHTML = `
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
```

## 📝 Documentation Tasks

### Create JavaScript Architecture Guide
Create `week1/day3/docs/javascript-architecture.md`:

```markdown
# JavaScript Architecture Guide

## Module System
- ES6 modules with import/export to control scope and encapsulation.
- Single Responsibility Principle (e.g. `DataManager` exclusively manages network logic, `ChartManager` handles canvas paints).

## Design Patterns
- **Observer/PubSub**: `DataManager` and `PerformanceMonitor` both allow dynamic subscribers arrays so charts/panels react to data changes.
- **Singleton tendencies**: Modules act as singleton instances inside `app.js` to ensure cache is globally reused.

## Performance Optimization
- **Data Caching / TTL**: Prevents repetitive network hits when data is fresh.
- **AbortController / Edge cancellation**: Ensures we do not process outdated HTTP promises.
- **Canvas Destruction**: Rebuilding charts onto existing canvases leaves ghost contexts. Erase before repaint.
```

### Create Performance Best Practices
Create `week1/day3/docs/performance-guide.md`:

```markdown
# JavaScript Performance Guide

## Optimization Techniques
- **Debouncing Execution**: Preventing Rapid-fire window resize recalculations by utilizing a timer mechanism.
- **Passive Event Listeners**: Using `passive: true` on scroll listeners guarantees to the browser that `preventDefault()` will not be called, resulting in smooth scrolling without main-thread blocking.
- **Local Storage Quota management**: Capping array length to 100 historical metric objects so we never exhaust the typical 5MB storage limit and throw a QUOTA error.

## Memory Management
- **Event listener cleanups**: Always detach generic event handlers or unsubscribe to instances.
- **Tracking references**: Removing references sets them up for natural Garbage Collection (e.g., calling GC with map deletes and activeRequest sweeps).
```

## 🧪 Testing & Validation

### Performance Testing
- [ ] Lighthouse score > 90
- [ ] First Contentful Paint < 1.5s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Cumulative Layout Shift < 0.1

### Functionality Testing
- [ ] All charts render correctly
- [ ] Data updates in real-time
- [ ] Performance metrics display
- [ ] Error handling works gracefully on network drops or bad caches

## 📊 Success Criteria

By the end of Day 3, you should have:

✅ **ES6+ Mastery**: Advanced JavaScript features implemented with resilient mechanisms.  
✅ **Module System**: Clean, organized code structure without polluting the global footprint.  
✅ **Data Visualization**: Interactive charts with Chart.js handled optimally for memory.  
✅ **Performance Monitoring**: Real-time performance tracking with resilient Web Vitals monitoring.  
✅ **Error Handling**: Robust error management avoiding cascading failures.  

## 🔄 Next Steps

1. **Commit your work**: `git add . && git commit -m "Complete Day 3: JavaScript Advanced"`
2. **Create PR**: Submit pull request for code review
3. **Prepare for Day 4**: Review React concepts and hooks
4. **Update progress**: Document your learning in the daily summary

## 📚 Additional Resources

- [MDN JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)
- [Chart.js Documentation](https://www.chartjs.org/docs/)
- [AbortController - MDN](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)
- [Web Vitals Chrome Developers](https://web.dev/vitals/)

---

**Ready for Day 4? Check out [Day 4: React Advanced](../day4/README.md)!** 🚀
