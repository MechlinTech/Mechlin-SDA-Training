import { memo, useMemo } from 'react';
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

  const changeClass = change >= 0 ? 'positive' : 'negative';

  return (
    <article
      className="metric-card"
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="metric-card-header">
        <h3>{title}</h3>

        <span className="metric-icon" aria-hidden="true">
          {icon}
        </span>
      </div>

      <div className="metric-value">
        {formattedValue}
      </div>

      <div className={`metric-change ${changeClass}`}>
        <span>
          {change >= 0 ? '+' : ''}
          {change}%
        </span>

        <span className="metric-trend">
          Trend: {trend}
        </span>
      </div>
    </article>
  );
});

MetricsCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
  change: PropTypes.number,
  trend: PropTypes.string,
  icon: PropTypes.node,
  onClick: PropTypes.func
};

MetricsCard.defaultProps = {
  change: 0,
  trend: 'Stable',
  icon: null,
  onClick: undefined
};