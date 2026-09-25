
import { MetricsCard } from './MetricsCard';

export function MetricsGrid({ data }) {
  const users = data?.users ?? [];
  const revenue = data?.revenue ?? [];
  const orders = data?.orders ?? [];

  const totalUsers = Array.isArray(users)
    ? users.length
    : Number(users) || 0;

  const totalRevenue = Array.isArray(revenue)
    ? revenue.reduce(
        (total, item) =>
          total + Number(item?.value ?? item?.amount ?? 0),
        0
      )
    : Number(revenue) || 0;

  const totalOrders = Array.isArray(orders)
    ? orders.length
    : Number(orders) || 0;

  const metrics = [
    {
      title: 'Total Users',
      value: totalUsers,
      change: 12.5,
      trend: 'Growing',
      icon: '👥'
    },
    {
      title: 'Revenue',
      value: totalRevenue,
      change: 8.2,
      trend: 'Increasing',
      icon: '💰'
    },
    {
      title: 'Orders',
      value: totalOrders,
      change: 5.7,
      trend: 'Stable',
      icon: '📦'
    }
  ];

  return (
    <section className="metrics-grid" aria-label="Dashboard metrics">
      {metrics.map((metric) => (
        <MetricsCard
          key={metric.title}
          {...metric}
        />
      ))}
    </section>
  );
}