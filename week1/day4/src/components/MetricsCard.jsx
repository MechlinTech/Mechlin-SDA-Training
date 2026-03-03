import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';

export const MetricsCard = memo(function MetricsCard({
    title,
    value,
    change,
    trend,
    icon,
    onClick
}) {
    const formattedValue = useMemo(() => {
        if (typeof value === 'number') {
            return value.toLocaleString();
        }
        return value;
    }, [value]);

    const changeClass = useMemo(() => {
        if (change > 0) return 'positive';
        if (change < 0) return 'negative';
        return 'neutral';
    }, [change]);

    return (
        <div className="metrics-card" onClick={onClick} style={{ background: '#1e293b', padding: '15px', borderRadius: '8px', cursor: onClick ? 'pointer' : 'default' }}>
            <div className="card-header" style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <span className="card-icon" style={{ marginRight: '10px' }}>{icon}</span>
                <h3 className="card-title" style={{ margin: 0, fontSize: '1.2rem', color: '#fff' }}>{title}</h3>
            </div>
            <div className="card-content">
                <div className="card-value" style={{ fontSize: '2rem', fontWeight: 'bold' }}>{formattedValue}</div>
                <div className={`card-change ${changeClass}`} style={{ color: change > 0 ? '#10b981' : change < 0 ? '#ef4444' : '#94a3b8' }}>
                    {change > 0 ? '+' : ''}{change}%
                </div>
            </div>
            {trend && (
                <div className="card-trend" style={{ marginTop: '10px', fontSize: '0.9rem', color: '#cbd5e1' }}>
                    <span className="trend-label">Trend: </span>
                    <span className="trend-value">{trend}</span>
                </div>
            )}
        </div>
    );
});

MetricsCard.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    change: PropTypes.number,
    trend: PropTypes.string,
    icon: PropTypes.string,
    onClick: PropTypes.func
};

MetricsCard.defaultProps = {
    change: 0,
    trend: null,
    icon: '📊',
    onClick: null
};
