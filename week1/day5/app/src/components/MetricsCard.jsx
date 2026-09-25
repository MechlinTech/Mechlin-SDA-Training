function MetricsCard({
  title,
  value,
  change = 0,
  selected = false,
  onClick,
}) {
  const formattedValue =
    typeof value === "number"
      ? value.toLocaleString()
      : value;

  const numericChange = Number(change) || 0;

  return (
    <button
      type="button"
      className={`metrics-card ${selected ? "metrics-card-selected" : ""}`}
      onClick={onClick}
    >
      <div className="metrics-card-header">
        <span>{title}</span>
        <span className="metrics-card-indicator">↗</span>
      </div>

      <div className="metrics-card-value">
        {formattedValue}
      </div>

      <div
        className={`metrics-card-change ${
          numericChange >= 0 ? "positive" : "negative"
        }`}
      >
        {numericChange >= 0 ? "+" : ""}
        {numericChange}%
      </div>
    </button>
  );
}

export default MetricsCard;