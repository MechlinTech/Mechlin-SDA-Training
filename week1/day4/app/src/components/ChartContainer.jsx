import { useMemo } from 'react';

export function ChartContainer({
  data,
  selectedMetric,
  onMetricChange
}) {
  const chartData = useMemo(() => {
    const values = data?.[selectedMetric];

    if (!Array.isArray(values)) {
      return [];
    }

    return values.map((item, index) => {
      if (typeof item === 'number') {
        return {
          label: `Point ${index + 1}`,
          value: item
        };
      }

      return {
        label:
          item?.label ??
          item?.date ??
          item?.name ??
          `Point ${index + 1}`,
        value: Number(
          item?.value ??
          item?.amount ??
          item?.total ??
          0
        )
      };
    });
  }, [data, selectedMetric]);

  const maxValue = Math.max(
    ...chartData.map((item) => item.value),
    1
  );

  return (
    <section className="chart-container">
      <div className="chart-header">
        <div>
          <h2>Data Visualization</h2>
          <p>Interactive dashboard metrics</p>
        </div>

        <label>
          Metric
          <select
            value={selectedMetric}
            onChange={(event) =>
              onMetricChange(event.target.value)
            }
          >
            <option value="revenue">Revenue</option>
            <option value="users">Users</option>
            <option value="orders">Orders</option>
          </select>
        </label>
      </div>

      {chartData.length === 0 ? (
        <div className="chart-empty">
          No data available for this metric.
        </div>
      ) : (
        <div
          className="bar-chart"
          role="img"
          aria-label={`${selectedMetric} chart`}
        >
          {chartData.map((item) => (
            <div className="bar-item" key={item.label}>
              <div className="bar-value">
                {item.value.toLocaleString()}
              </div>

              <div className="bar-track">
                <div
                  className="bar"
                  style={{
                    height: `${Math.max(
                      (item.value / maxValue) * 100,
                      4
                    )}%`
                  }}
                />
              </div>

              <span className="bar-label">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}