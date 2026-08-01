import React from "react";

function MetricsCard({ title, value, icon, type, change }) {
  return (
    <div className={`card ${type}`}>
      <div className="card-icon">{icon}</div>

      <h3>{title}</h3>

      <p className="metric">{value}</p>

      <p className={`metric-change ${change >= 0 ? "positive" : "negative"}`}>
        {change >= 0 ? "+" : ""}
        {change}% from last month
      </p>
    </div>
  );
}

export default React.memo(MetricsCard);