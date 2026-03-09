import React from "react";

const ResultTable = ({ columns, rows, error }) => {
  if (error) {
    return (
      <div className="error-box" data-testid="query-error-message">
        {error}
      </div>
    );
  }

  if (!rows || rows.length === 0) {
    return (
      <div className="empty-state" data-testid="query-empty-result-message">
        Run a query to see results.
      </div>
    );
  }

  return (
    <div className="result-table-wrapper" data-testid="query-result-table-wrapper">
      <table className="result-table" data-testid="query-result-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column} data-testid={`query-column-${column}`}>
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={`row-${rowIndex}`} data-testid={`query-row-${rowIndex}`}>
              {columns.map((column) => (
                <td
                  key={`${rowIndex}-${column}`}
                  data-testid={`query-cell-${rowIndex}-${column}`}
                >
                  {String(row[column] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResultTable;
