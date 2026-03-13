import React, { useState } from "react";
import SQLEditor from "@/components/SQLEditor";
import ResultTable from "@/components/ResultTable";
import HintBox from "@/components/HintBox";
import QueryHistoryPanel from "@/components/QueryHistoryPanel";
import DataInsightsPanel from "@/components/DataInsightsPanel";
import { executeQuery, getHint } from "@/services/api";

const Playground = () => {

const [query, setQuery] = useState(`-- Welcome to SQL Playground
-- Start by creating a table

CREATE TABLE students (
id INT,
name TEXT,
age INT
);

-- Then insert data
-- INSERT INTO students VALUES (1,'Aarav',20);

-- Run your queries below
`);

const [result, setResult] = useState({ columns: [], rows: [] });
const [queryError, setQueryError] = useState("");
const [hint, setHint] = useState("");
const [loadingHint, setLoadingHint] = useState(false);
const [historyItems, setHistoryItems] = useState([]);

const handleRunQuery = async () => {

if (!query.trim()) {
  setQueryError("Query cannot be empty.");
  return;
}

setQueryError("");

try {

  const response = await executeQuery({
    query,
    assignmentId: null
  });

  const data = {
    columns: response.columns || [],
    rows: response.rows || []
  };

  setResult(data);

  setHistoryItems(prev => [
    {
      queryText: query,
      executionStatus: "success",
      timestamp: new Date().toISOString()
    },
    ...prev
  ]);

} catch (error) {

  setResult({ columns: [], rows: [] });

  setQueryError(
    error?.response?.data?.message ||
    "Query execution failed."
  );

  setHistoryItems(prev => [
    {
      queryText: query,
      executionStatus: "error",
      timestamp: new Date().toISOString()
    },
    ...prev
  ]);

}


};

const handleClear = () => {
setQuery("");
setResult({ columns: [], rows: [] });
setQueryError("");
};

const handleGetHint = async () => {

setLoadingHint(true);

try {

  const response = await getHint({ query });

  setHint(
    response?.hint ||
    "Check your SQL syntax, table names, and column references."
  );

} catch {

  setHint(
    "Hint service is currently unavailable. Review your SQL structure."
  );

} finally {
  setLoadingHint(false);
}


};

return ( <main className="assignment-attempt-page">

  <header className="playground-header">
    <h1>SQL Playground</h1>
    <p>Write SQL queries from scratch and test them instantly.</p>
  </header>

  <section className="playground-layout">

    {/* SQL Editor */}
    <div className="panel editor-panel">

      <h2>SQL Editor</h2>

      <SQLEditor
        value={query}
        onChange={setQuery}
      />

      <div className="editor-actions">

        <button
          className="primary-button"
          onClick={handleRunQuery}
        >
          Run Query
        </button>

        <button
          className="secondary-button"
          onClick={handleClear}
        >
          Reset
        </button>

      </div>

    </div>

    {/* Result Panel */}
    <div className="panel result-panel">

      <h2>Result</h2>

      <ResultTable
        columns={result.columns}
        rows={result.rows}
        error={queryError}
      />

      <DataInsightsPanel
        columns={result.columns}
        rows={result.rows}
        error={queryError}
      />

    </div>

    {/* AI Hint */}
    <HintBox
      hint={hint}
      loading={loadingHint}
      onGetHint={handleGetHint}
    />

    {/* Query History */}
    <QueryHistoryPanel
      historyItems={historyItems}
      loading={false}
      error=""
      onLoadQuery={setQuery}
    />

  </section>

</main>

);
};

export default Playground;
