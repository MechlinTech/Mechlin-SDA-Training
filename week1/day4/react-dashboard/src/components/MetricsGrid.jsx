import { MetricsCard } from './MetricsCard';

export function MetricsGrid() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
      <MetricsCard title="Users" value={1234} change={12} icon="👥" />
      <MetricsCard title="Revenue" value="$45,678" change={8} icon="💰" />
      <MetricsCard title="Orders" value={567} change={-3} icon="📦" />
    </div>
  );
}
