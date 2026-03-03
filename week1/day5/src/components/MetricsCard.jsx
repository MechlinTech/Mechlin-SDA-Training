import React from 'react';
import { ArrowUpRight, ArrowDownRight, RefreshCw, AlertCircle } from 'lucide-react';

export function MetricsCard({ title, value, change, loading, error, connected, onRefresh }) {
    const isPositive = change >= 0;

    // Format based on metric type
    const formattedValue = title.toLowerCase() === 'revenue'
        ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
        : new Intl.NumberFormat('en-US').format(value);

    if (loading && !value) {
        return (
            <div className="metric-card loading-skeleton">
                <div className="skeleton-line title" />
                <div className="skeleton-line big-value" />
            </div>
        );
    }

    return (
        <div className={`metric-card ${connected ? 'live' : 'offline'}`}>
            <div className="metric-header">
                <span className="metric-title">{title}</span>

                {/* Subtle dot to indicate if THIS specific hook is receiving live WebSockets */}
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {error && <AlertCircle size={16} color="#ef4444" title={error} />}
                    <div
                        style={{
                            width: 8, height: 8, borderRadius: '50%',
                            backgroundColor: connected ? '#10b981' : '#6b7280',
                            boxShadow: connected ? '0 0 8px rgba(16, 185, 129, 0.4)' : 'none',
                            transition: 'all 0.3s ease'
                        }}
                        title={connected ? "Live Updates Active" : "Waiting for connection..."}
                    />
                </div>
            </div>

            <div className="metric-value">{formattedValue}</div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className={`metric-change ${isPositive ? 'change-positive' : 'change-negative'}`}>
                    {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    <span style={{ marginLeft: 4 }}>{Math.abs(change).toFixed(2)}%</span>
                </div>

                {/* Manual refresh via REST fallback */}
                <button
                    onClick={onRefresh}
                    disabled={loading}
                    style={{ background: 'none', border: 'none', color: '#64748b', cursor: loading ? 'not-allowed' : 'pointer' }}
                    title="Force REST API fetch"
                >
                    <RefreshCw size={14} className={loading ? 'spinning' : ''} />
                </button>
            </div>
        </div>
    );
}
