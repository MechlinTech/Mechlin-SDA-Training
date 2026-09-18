import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';

export const MetricsCard = memo(function MetricsCard({ 
  title, value, change, icon
}) {
  const formattedValue = useMemo(() => {
    return typeof value === 'number' ? value.toLocaleString() : value;
  }, [value]);

  const changeClass = change > 0 ? 'positive' : change < 0 ? 'negative' : 'neutral';

  return (
    <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h3 style={{ color: '#64748b', fontSize: '14px', textTransform: 'uppercase', margin: 0 }}>{title}</h3>
        <span style={{ fontSize: '24px' }}>{icon}</span>
      </div>
      <div>
        <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1e293b' }}>{formattedValue}</div>
        <div style={{ color: change > 0 ? '#10b981' : '#ef4444', fontWeight: 'bold', marginTop: '10px' }}>
          {change > 0 ? '+' : ''}{change}% from last month
        </div>
      </div>
    </div>
  );
});

MetricsCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  change: PropTypes.number,
  icon: PropTypes.string
};

MetricsCard.defaultProps = {
  change: 0,
  icon: '📊'
};
