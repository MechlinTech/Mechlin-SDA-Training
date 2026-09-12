import React, { useEffect, useRef } from 'react';
import {
    Chart,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    LineController,
    BarController,
    DoughnutController,
    Tooltip,
    Legend
} from 'chart.js';

Chart.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    LineController,
    BarController,
    DoughnutController,
    Tooltip,
    Legend
);

const ChartContainer = ({ type, data, options }) => {
    const canvasRef = useRef(null);
    const chartRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;

        if (!canvas || !data) {
            return;
        }

        // Destroy our existing chart
        if (chartRef.current) {
            chartRef.current.destroy();
            chartRef.current = null;
        }

        // Destroy any Chart.js instance already attached to this canvas
        const existingChart = Chart.getChart(canvas);

        if (existingChart) {
            existingChart.destroy();
        }

        chartRef.current = new Chart(canvas, {
            type,
            data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                ...options
            }
        });

        return () => {
            if (chartRef.current) {
                chartRef.current.destroy();
                chartRef.current = null;
            }
        };
    }, [type, data, options]);

    return (
        <div
            className="chart-container"
            style={{
                position: 'relative',
                height: '300px'
            }}
        >
            <canvas ref={canvasRef}></canvas>
        </div>
    );
};

export default ChartContainer;