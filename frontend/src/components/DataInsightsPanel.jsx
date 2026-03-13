import React, { useMemo } from "react";

const getNumericValues = (rows, column) => {
  const values = rows
    .map((row) => Number(row[column]))
    .filter((value) => Number.isFinite(value));

  return values;
};

const calculateStats = (values) => {
  const sorted = [...values].sort((a, b) => a - b);
  const count = sorted.length;

  const mean = sorted.reduce((sum, v) => sum + v, 0) / count;

  const median =
    count % 2 === 0
      ? (sorted[count / 2 - 1] + sorted[count / 2]) / 2
      : sorted[Math.floor(count / 2)];

  const variance =
    sorted.reduce((sum, v) => sum + (v - mean) ** 2, 0) / count;

  const stdDev = Math.sqrt(variance);

  const outliers =
    stdDev === 0
      ? []
      : sorted.filter((v) => Math.abs(v - mean) > 2 * stdDev);

  return {
    mean,
    median,
    min: sorted[0],
    max: sorted[sorted.length - 1],
    stdDev,
    outliers,
  };
};

const round = (value) => Number(value.toFixed(2));

const DataInsightsPanel = ({ columns, rows, error }) => {
  const insights = useMemo(() => {
    if (!rows?.length || !columns?.length || error) return [];

    return columns
      .map((column) => {
        const values = getNumericValues(rows, column);
        if (!values.length) return null;

        return {
          column,
          count: values.length,
          ...calculateStats(values),
        };
      })
      .filter(Boolean);
  }, [columns, rows, error]);

  if (!rows?.length || error) return null;

  return (
    <section className="data-insights">
      <h3>Data Insights</h3>

      {insights.length === 0 && (
        <p className="empty-state">
          No numeric columns detected for analytics.
        </p>
      )}

      {insights.length > 0 && (
        <div className="data-insights__grid">
          {insights.map((insight) => (
            <article key={insight.column} className="data-insights__card">
              <h4>{insight.column}</h4>

              <ul>
                <li>Count: {insight.count}</li>
                <li>Mean: {round(insight.mean)}</li>
                <li>Median: {round(insight.median)}</li>
                <li>Minimum: {round(insight.min)}</li>
                <li>Maximum: {round(insight.max)}</li>
                <li>Std Dev: {round(insight.stdDev)}</li>
                <li>
                  Outliers: {insight.outliers.length
                    ? insight.outliers.join(", ")
                    : "None"}
                </li>
              </ul>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default DataInsightsPanel;