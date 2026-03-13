import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SQLEditor from "@/components/SQLEditor";
import ResultTable from "@/components/ResultTable";
import HintBox from "@/components/HintBox";
import QueryHistoryPanel from "@/components/QueryHistoryPanel";
import DataInsightsPanel from "@/components/DataInsightsPanel";
import {
  executeQuery,
  getAssignmentById,
  getHint,
  getHistoryByAssignment,
} from "@/services/api";

const AssignmentAttempt = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [assignment, setAssignment] = useState(null);
  const [query, setQuery] = useState("SELECT * FROM students;");
  const [result, setResult] = useState({ columns: [], rows: [] });
  const [queryError, setQueryError] = useState("");
  const [hint, setHint] = useState("");
  const [loadingHint, setLoadingHint] = useState(false);
  const [loadingAssignment, setLoadingAssignment] = useState(true);
  const [historyItems, setHistoryItems] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [historyError, setHistoryError] = useState("");

  const loadHistory = async () => {
    setLoadingHistory(true);
    setHistoryError("");

    try {
      const history = await getHistoryByAssignment(id);
      setHistoryItems(history);
    } catch (_error) {
      setHistoryError("Unable to load query history right now.");
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    const loadAssignment = async () => {
      try {
        const data = await getAssignmentById(id);
        setAssignment(data);
      } catch (_error) {
        setQueryError("Unable to load assignment details.");
      } finally {
        setLoadingAssignment(false);
      }
    };

    loadAssignment();
    loadHistory();
  }, [id]);

  const sampleDataString = useMemo(() => {
    if (!assignment?.sampleData) {
      return "No sample data available.";
    }
    return JSON.stringify(assignment.sampleData, null, 2);
  }, [assignment]);

  const handleRunQuery = async () => {
    if (!query.trim()) {
      setQueryError("Query cannot be empty.");
      return;
    }

    setQueryError("");
    try {
      const response = await executeQuery({ assignmentId: id, query });
      setResult({ columns: response.columns || [], rows: response.rows || [] });
    } catch (error) {
      setResult({ columns: [], rows: [] });
      setQueryError(error?.response?.data?.message || "Query execution failed.");
    } finally {
      loadHistory();
    }
  };

  const handleGetHint = async () => {
    setLoadingHint(true);
    try {
      const response = await getHint({ assignmentId: id, query });
      setHint(response.hint || "Try breaking the question into smaller steps.");
    } catch (_error) {
      setHint("Hint service is currently unavailable. Check table names and clauses.");
    } finally {
      setLoadingHint(false);
    }
  };

  if (loadingAssignment) {
    return (
      <main className="assignment-attempt-page" data-testid="assignment-attempt-page">
        <p className="empty-state" data-testid="assignment-attempt-loading">
          Loading assignment...
        </p>
      </main>
    );
  }

  return (
    <main className="assignment-attempt-page" data-testid="assignment-attempt-page">
      <header className="attempt-header" data-testid="assignment-attempt-header">
        <button
          type="button"
          className="secondary-button"
          data-testid="back-to-list-button"
          onClick={() => navigate("/")}
        >
          ← Back to Assignments
        </button>

        {assignment && (
          <div className="attempt-header__meta" data-testid="assignment-header-meta">
            <h1 data-testid="attempt-title">{assignment.title}</h1>
            <span data-testid="attempt-difficulty">{assignment.difficulty}</span>
          </div>
        )}
      </header>

      {assignment && (
        <section className="attempt-layout" data-testid="assignment-attempt-layout">
          <div className="attempt-left-column" data-testid="attempt-left-column">
            <div className="panel question-panel" data-testid="question-panel">
              <h2 data-testid="question-panel-title">Question</h2>
              <p data-testid="question-panel-description">{assignment.description}</p>
            </div>

            <div className="panel sample-panel" data-testid="sample-data-panel">
              <h2 data-testid="sample-data-title">Schema + Sample Data</h2>
              <pre data-testid="schema-content">{assignment.schema}</pre>
              <pre data-testid="sample-data-content">{sampleDataString}</pre>
            </div>
          </div>

          <div className="attempt-right-column" data-testid="attempt-right-column">
            <div className="panel editor-panel" data-testid="editor-panel">
              <h2 data-testid="editor-panel-title">SQL Editor</h2>
              <SQLEditor value={query} onChange={setQuery} />

              <div className="editor-actions" data-testid="editor-actions">
                <button
                  type="button"
                  className="primary-button"
                  data-testid="execute-query-button"
                  onClick={handleRunQuery}
                >
                  Execute Query
                </button>

                <button
                  type="button"
                  className="secondary-button"
                  data-testid="clear-query-button"
                  onClick={() => setQuery("")}
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="panel result-panel" data-testid="result-panel">
              <h2 data-testid="result-panel-title">Result</h2>
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

            <HintBox hint={hint} loading={loadingHint} onGetHint={handleGetHint} />

            <QueryHistoryPanel
              historyItems={historyItems}
              loading={loadingHistory}
              error={historyError}
              onLoadQuery={setQuery}
            />
          </div>
        </section>
      )}
    </main>
  );
};

export default AssignmentAttempt;
