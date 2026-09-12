import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';

const MetricsCard = memo(({ title, value, change, icon }) => {
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
        <div className="metrics-card">
            <div className="metrics-card-header">
                <span className="metrics-card-title">{title}</span>
                {icon && <span className="metrics-card-icon">{icon}</span>}
            </div>

            <div className="metrics-card-value">
                {formattedValue}
            </div>

            {change !== undefined && (
                <div className={`metrics-card-change ${changeClass}`}>
                    {change > 0 ? '↑' : change < 0 ? '↓' : '→'}
                    {' '}
                    {Math.abs(change)}%
                </div>
            )}
        </div>
    );
});

MetricsCard.displayName = 'MetricsCard';

MetricsCard.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]).isRequired,
    change: PropTypes.number,
    icon: PropTypes.node
};

export default MetricsCard;