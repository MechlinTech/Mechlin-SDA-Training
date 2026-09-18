import React from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement,
  Title, Tooltip, Legend, Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement,
  Title, Tooltip, Legend, Filler
);

export function ChartContainer({ data }) {
  if (!data.revenue || !data.revenue.labels) return <p>No data</p>;

  const revenueChartData = {
    labels: data.revenue.labels,
    datasets: [{
      label: 'Revenue',
      data: data.revenue.values,
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      fill: true,
      tension: 0.4
    }]
  };

  const usersChartData = {
    labels: data.users.labels,
    datasets: [{
      label: 'Users',
      data: data.users.values,
      backgroundColor: 'rgba(16, 185, 129, 0.8)'
    }]
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '30px' }}>
      <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h3 style={{ color: '#64748b' }}>Revenue Trend</h3>
        <div style={{ height: '300px' }}><Line data={revenueChartData} options={{ maintainAspectRatio: false }} /></div>
      </div>
      <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h3 style={{ color: '#64748b' }}>User Growth</h3>
        <div style={{ height: '300px' }}><Bar data={usersChartData} options={{ maintainAspectRatio: false }} /></div>
      </div>
    </div>
  );
}
