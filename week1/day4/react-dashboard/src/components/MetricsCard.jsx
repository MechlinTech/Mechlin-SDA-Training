import React, { memo, useMemo } from "react";
import PropTypes from "prop-types";
import { useTheme } from "../contexts/ThemeContext";

export const MetricsCard = memo(function MetricsCard({
  title,
  values,
  icon
}) {

  const theme = useTheme();

  const total = useMemo(() => {
    if (!Array.isArray(values)) return 0;
    return values.reduce((sum, val) => sum + val, 0);
  }, [values]);

  const [prevTotal, setPrevTotal] = React.useState(total);
  const [highlight, setHighlight] = React.useState(false);

  React.useEffect(() => {
    if (total !== prevTotal) {
      setHighlight(true);
      setTimeout(() => setHighlight(false), 800);
      setPrevTotal(total);
    }
  }, [total, prevTotal]);


  const cardStyle = {
    background: highlight ? "#bbf7d0" : theme.cardBg,  
    color: theme.text,
    padding: "20px",
    borderRadius: "12px",
    boxShadow: theme.darkMode
      ? "0 2px 10px rgba(0,0,0,0.5)"
      : "0 2px 8px rgba(0,0,0,0.1)",
    textAlign: "center",
    transition: "all 0.3s ease",
    cursor: "default"
  };

  const iconStyle = {
    fontSize: "28px",
    marginBottom: "10px"
  };

  const valueStyle = {
    fontSize: "22px",
    fontWeight: "bold",
    marginTop: "8px"
  };

  return (
    <div style={cardStyle}>
      <div style={iconStyle}>{icon}</div>
      <h3>{title}</h3>
      <p style={valueStyle}>
        {total.toLocaleString()}
      </p>
    </div>
  );
});

MetricsCard.propTypes = {
  title: PropTypes.string.isRequired,
  values: PropTypes.array,
  icon: PropTypes.string
};

MetricsCard.defaultProps = {
  values: [],
  icon: "📊"
};