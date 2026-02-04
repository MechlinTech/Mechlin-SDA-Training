
// src/modules/ChartManager.js

export class ChartManager {
  constructor(containerClass, dataManager) {
    this.container = document.querySelector(`.${containerClass}`);
    this.dataManager = dataManager;
    this.charts = new Map();
    this.init();
  }

  async init() {
    await this.loadChartLibrary();
    await this.createCharts();
  }

  async loadChartLibrary() {
    if (window.Chart) return;

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  destroyChartIfExists(id) {
    if (this.charts.has(id)) {
      this.charts.get(id).destroy();
      this.charts.delete(id);
    }
  }

  destroyAllCharts() {
    this.charts.forEach(chart => chart.destroy());
    this.charts.clear();
  }

  async createCharts() {
    try {
      this.destroyAllCharts();

      // 🔴 FIX: endpoints MUST match DataContext
      const [users, revenue, orders] = await Promise.all([
        this.dataManager.fetchData('/users'),
        this.dataManager.fetchData('/revenue'),
        this.dataManager.fetchData('/orders')
      ]);

      this.createLineChart('revenueChart', revenue);
      this.createBarChart('userChart', users);
      this.createDoughnutChart('orderChart', orders);
      this.createMixedChart('performanceChart', { users, revenue, orders });
    } catch (err) {
      console.error('Chart creation error:', err);
    }
  }

  getContext(id) {
    const canvas = document.getElementById(id);
    if (!canvas) return null;
    return canvas.getContext('2d');
  }

  createLineChart(id, data) {
    const ctx = this.getContext(id);
    if (!ctx) return;

    this.destroyChartIfExists(id);

    this.charts.set(id, new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.labels,
        datasets: [{
          label: 'Revenue',
          data: data.values,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59,130,246,0.15)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation:false
      }
    }));
  }

  createBarChart(id, data) {
    const ctx = this.getContext(id);
    if (!ctx) return;

    this.destroyChartIfExists(id);

    this.charts.set(id, new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.labels,
        datasets: [{
          label: 'Users',
          data: data.values,
          backgroundColor: '#10b981'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false
      }
    }));
  }

  createDoughnutChart(id, data) {
    const ctx = this.getContext(id);
    if (!ctx) return;

    this.destroyChartIfExists(id);

    this.charts.set(id, new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: data.labels,
        datasets: [{
          data: data.values,
          backgroundColor: ['#3b82f6', '#10b981', '#f59e0b']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false
      }
    }));
  }

  createMixedChart(id, data) {
    const ctx = this.getContext(id);
    if (!ctx) return;

    this.destroyChartIfExists(id);

    this.charts.set(id, new Chart(ctx, {
      data: {
        labels: data.users.labels,
        datasets: [
          {
            type: 'bar',
            label: 'Users',
            data: data.users.values,
            backgroundColor: '#3b82f6'
          },
          {
            type: 'line',
            label: 'Revenue',
            data: data.revenue.values,
            borderColor: '#10b981',
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false
      }
    }));
  }
}
