import React from "react";

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return Number.isNaN(date.getTime()) ? "Unknown time" : date.toLocaleString();
};

const QueryHistoryPanel = ({ historyItems, loading, error, onLoadQuery }) => {
  if (loading) {
    return (
      <section className="query-history">
        <h3>Previous Queries</h3>
        <p className="empty-state">Loading previous queries...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="query-history">
        <h3>Previous Queries</h3>
        <p className="error-box">{error}</p>
      </section>
    );
  }

  return (
    <section className="query-history">
      <div className="query-history__header">
        <h3>Previous Queries</h3>
      </div>

      {historyItems.length === 0 ? (
        <p className="empty-state">
          No previous queries yet. Execute a query to build your history.
        </p>
      ) : (
        <ul className="query-history__list">
          {historyItems.map((item, index) => (
            <li
              key={`${item.timestamp}-${index}`}
              className="query-history__item"
            >
              <div className="query-history__item-meta">
                <span className={`status-pill status-pill--${item.executionStatus}`}>
                  {item.executionStatus}
                </span>

                <span>{formatTimestamp(item.timestamp)}</span>
              </div>

              <pre>{item.queryText}</pre>

              <button
                type="button"
                className="secondary-button"
                onClick={() => onLoadQuery(item.queryText)}
              >
                Load Query
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default QueryHistoryPanel;