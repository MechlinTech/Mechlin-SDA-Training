
// src/components/Dashboard.jsx
import { useState, useEffect, useReducer } from 'react';
import { useDataContext } from '../contexts/DataContext';
import { ChartContainer } from './ChartContainer';
import { MetricsGrid } from './MetricsGrid';
import { PerformancePanel } from './PerformancePanel';

const initialState = {
  loading: true,
  error: null,
  data: {
    users: [],
    revenue: [],
    orders: []
  }
};

function dataReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_DATA':
      return { ...state, data: action.payload, loading: false, error: null };
    default:
      return state;
  }
}

export function Dashboard() {
  const [state, dispatch] = useReducer(dataReducer, initialState);
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  const { fetchData } = useDataContext(); // ✅ use custom hook, not useContext directly

  useEffect(() => {
    const loadData = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });

        const [users, revenue, orders] = await Promise.all([
          fetchData('/users'),
          fetchData('/revenue'),
          fetchData('/orders')
        ]);

        dispatch({
          type: 'SET_DATA',
          payload: { users, revenue, orders }
        });
      } catch (err) {
        dispatch({ type: 'SET_ERROR', payload: err.message });
      }
    };

    loadData();
  }, [fetchData]);

  if (state.loading) {
    return <div className="loading-container">Loading dashboard…</div>;
  }

  if (state.error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{state.error}</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <MetricsGrid data={state.data} />

      <div className="charts-section">
        <ChartContainer
          data={state.data}
          selectedMetric={selectedMetric}
          onMetricChange={setSelectedMetric}
        />
      </div>

      <PerformancePanel />
    </div>
  );
}
