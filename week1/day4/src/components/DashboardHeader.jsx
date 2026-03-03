import React from 'react';

export function DashboardHeader({ filters, onFilterChange, onRefresh, viewMode, onViewModeChange }) {
    return (
        <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', padding: '15px', background: '#1e293b', borderRadius: '8px' }}>
            <div className="filters" style={{ display: 'flex', gap: '10px' }}>
                <select
                    value={filters.dateRange}
                    onChange={(e) => onFilterChange('dateRange', e.target.value)}
                    style={{ padding: '8px', borderRadius: '4px', background: '#334155', color: '#fff', border: '1px solid #475569' }}
                >
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                    <option value="90d">Last 90 Days</option>
                </select>

                <select
                    value={filters.category}
                    onChange={(e) => onFilterChange('category', e.target.value)}
                    style={{ padding: '8px', borderRadius: '4px', background: '#334155', color: '#fff', border: '1px solid #475569' }}
                >
                    <option value="all">All Categories</option>
                    <option value="electronics">Electronics</option>
                    <option value="clothing">Clothing</option>
                </select>
            </div>

            <div className="actions" style={{ display: 'flex', gap: '10px' }}>
                <button
                    onClick={() => onViewModeChange(viewMode === 'grid' ? 'list' : 'grid')}
                    style={{ padding: '8px 12px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                    Toggle View: {viewMode.toUpperCase()}
                </button>
                <button
                    onClick={onRefresh}
                    style={{ padding: '8px 12px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                    Refresh Data
                </button>
            </div>
        </div>
    );
}
