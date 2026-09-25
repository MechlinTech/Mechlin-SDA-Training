import "./ChartContainer.css";
function ChartContainer({ title, data, metric }) {
  const getValues = () => {
    if (!data) {
      return [];
    }

    if (Array.isArray(data)) {
      return data
        .map((item) => {
          if (typeof item === "number") {
            return item;
          }

          return Number(item.value ?? item.amount ?? item.total ?? 0);
        })
        .filter((value) => Number.isFinite(value));
    }

    if (Array.isArray(data?.values)) {
      return data.values
        .map((value) => Number(value))
        .filter((value) => Number.isFinite(value));
    }

    if (typeof data?.value === "number") {
      return [data.value];
    }

    if (typeof data?.total === "number") {
      return [data.total];
    }

    return [];
  };

  const values = getValues();

  const maxValue = Math.max(...values, 1);

  return (
    <div className="chart-container">
      <div className="chart-header">
        <div>
          <p className="chart-eyebrow">REAL-TIME DATA</p>
          <h2>{title}</h2>
        </div>

        <span className="chart-metric">
          {metric}
        </span>
      </div>

      {values.length === 0 ? (
        <div className="chart-empty">
          <p>No chart data available.</p>
        </div>
      ) : (
        <div className="chart-area">
          {values.map((value, index) => {
            const height = Math.max((value / maxValue) * 100, 5);

            return (
              <div className="chart-column" key={`${metric}-${index}`}>
                <div className="chart-value">
                  {value.toLocaleString()}
                </div>

                <div className="chart-bar-wrapper">
                  <div
                    className="chart-bar"
                    style={{ height: `${height}%` }}
                  />
                </div>

                <span className="chart-label">
                  {index + 1}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ChartContainer;