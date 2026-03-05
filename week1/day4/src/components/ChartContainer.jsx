import React, { useEffect, useRef } from 'react';

export function ChartContainer({ data, selectedMetric, onMetricChange }) {
    const chartRef = useRef(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        const loadChartJs = async () => {
            if (!window.Chart) {
                const script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
                script.async = true;
                document.head.appendChild(script);
                return new Promise((resolve) => {
                    script.onload = resolve;
                });
            }
        };

        const renderChart = async () => {
            await loadChartJs();

            if (chartRef.current) {
                chartRef.current.destroy();
            }

            if (!canvasRef.current || !data[selectedMetric]) return;

            const ctx = canvasRef.current.getContext('2d');

            let chartLabels = [];
            let chartValues = [];
            let labelName = '';
            let type = 'line';
            let bgColor = 'rgba(59, 130, 246, 0.1)';
            let borderColor = 'rgb(59, 130, 246)';

            const metricData = data[selectedMetric];

            if (metricData.labels && metricData.values) {
                chartLabels = metricData.labels;
                chartValues = metricData.values;
            } else {
                // Fallback for old structure if somehow still present
                if (Array.isArray(metricData)) {
                    if (selectedMetric === 'revenue') {
                        chartLabels = metricData.map(item => item.month || '');
                        chartValues = metricData.map(item => item.amount || 0);
                    } else if (selectedMetric === 'users') {
                        chartLabels = metricData.map(item => `User ${item.id}`);
                        chartValues = metricData.map(item => item.id * 10);
                    } else if (selectedMetric === 'orders') {
                        chartLabels = metricData.map(item => `Order ${item.id}`);
                        chartValues = metricData.map(item => item.total || 0);
                    }
                }
            }

            if (selectedMetric === 'revenue') {
                labelName = 'Revenue';
            } else if (selectedMetric === 'users') {
                labelName = 'Users';
                type = 'bar';
                bgColor = 'rgba(16, 185, 129, 0.8)';
                borderColor = 'rgb(16, 185, 129)';
            } else if (selectedMetric === 'orders') {
                labelName = 'Orders';
                type = 'doughnut';
                bgColor = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];
                borderColor = '#fff';
            }

            chartRef.current = new window.Chart(ctx, {
                type: type,
                data: {
                    labels: chartLabels,
                    datasets: [{
                        label: labelName,
                        data: chartValues,
                        backgroundColor: bgColor,
                        borderColor: borderColor,
                        borderWidth: 1,
                        tension: 0.4,
                        fill: type === 'line'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
        };

        renderChart();

        return () => {
            if (chartRef.current) {
                chartRef.current.destroy();
            }
        };
    }, [data, selectedMetric]);

    return (
        <div className="chart-container" style={{ background: '#1e293b', padding: '20px', borderRadius: '8px', marginTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                <h3 style={{ margin: 0, color: '#fff' }}>Chart Overview</h3>
                <select value={selectedMetric} onChange={(e) => onMetricChange(e.target.value)} style={{ padding: '8px', borderRadius: '4px', background: '#334155', color: '#fff', border: '1px solid #475569' }}>
                    <option value="revenue">Revenue</option>
                    <option value="users">Users</option>
                    <option value="orders">Orders</option>
                </select>
            </div>
            <div style={{ height: '300px', width: '100%', position: 'relative' }}>
                {(!data[selectedMetric] || data[selectedMetric].length === 0) ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8' }}>
                        No data to display
                    </div>
                ) : (
                    <canvas ref={canvasRef}></canvas>
                )}
            </div>
        </div>
    );
}
