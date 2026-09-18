import React, { useReducer, useEffect } from 'react';
import { useDataContext } from '../contexts/DataContext';
import { MetricsCard } from './MetricsCard';
import { ChartContainer } from './ChartContainer';
import { usePerformance } from '../hooks/usePerformance';

const initialState = {
  data: { users: [], revenue: [], orders: [] }
};

function dataReducer(state, action) {
  if (action.type === 'SET_DATA') {
    return { ...state, data: action.payload };
  }
  return state;
}

export function Dashboard() {
  const [state, dispatch] = useReducer(dataReducer, initialState);
  const { fetchData, loading, error } = useDataContext();
  const perfMetrics = usePerformance();

  const loadData = async () => {
    try {
      const [users, revenue, orders] = await Promise.all([
        fetchData('/api/users'),
        fetchData('/api/revenue'),
        fetchData('/api/orders')
      ]);
      dispatch({ type: 'SET_DATA', payload: { users, revenue, orders } });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, [fetchData]);

  if (loading && !state.data.users.labels) return <div style={{ padding: '40px', fontSize: '24px' }}>Loading Dashboard Data...</div>;
  if (error) return <div style={{ color: 'red', padding: '40px' }}>Error: {error}</div>;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#0f172a' }}>⚛️ React Advanced Dashboard</h1>
        <button onClick={loadData} style={{ padding: '10px 20px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
          🔄 Refresh Data
        </button>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
        <MetricsCard title="Total Users" value={8432} change={12} icon="👥" />
        <MetricsCard title="Total Revenue" value="$45,678" change={8} icon="💰" />
        <MetricsCard title="Total Orders" value={1256} change={-3} icon="📦" />
      </div>

      <ChartContainer data={state.data} />
      
      <div style={{ marginTop: '30px', padding: '20px', background: '#f8fafc', borderRadius: '8px', borderLeft: '4px solid #10b981' }}>
        <h3 style={{ margin: '0 0 10px 0' }}>Live System Metrics</h3>
        <div>Memory Used: <strong>{perfMetrics.memory || 0} MB</strong></div>
      </div>
    </div>
  );
}
