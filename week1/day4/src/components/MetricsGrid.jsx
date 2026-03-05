import React from 'react';
import { MetricsCard } from './MetricsCard';

export function MetricsGrid({ data }) {
    const userCount = data.users && data.users.length ? data.users.length : 0;
    const revenueTotal = data.revenue && data.revenue.reduce ? data.revenue.reduce() : 0;
    const orderCount = data.orders && data.orders.length ? data.orders.length : 0;

    return (
        <div className="metrics-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            <MetricsCard
                title="Total Users"
                value={userCount}
                change={5.2}
                icon="👤"
            />
            <MetricsCard
                title="Total Revenue"
                value={`$${revenueTotal.toLocaleString()}`}
                change={12.4}
                icon="💰"
            />
            <MetricsCard
                title="Total Orders"
                value={orderCount}
                change={-2.1}
                icon="📦"
            />
        </div>
    );
}
