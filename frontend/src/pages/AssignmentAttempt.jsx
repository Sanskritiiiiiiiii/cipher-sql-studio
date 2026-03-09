import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SQLEditor from "@/components/SQLEditor";
import ResultTable from "@/components/ResultTable";
import HintBox from "@/components/HintBox";
import { executeQuery, getAssignmentById, getHint } from "@/services/api";

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
  }, [id]);

  const sampleDataString = useMemo(() => {
    return assignment?.sampleData
      ? JSON.stringify(assignment.sampleData, null, 2)
      : "No sample data available.";
  }, [assignment]);

  const handleRunQuery = async () => {
    if (!query.trim()) {
      setQueryError("Query cannot be empty.");
      return;
    }

    setQueryError("");

    try {
      const response = await executeQuery({ assignmentId: id, query });

      setResult({
        columns: response.columns || [],
        rows: response.rows || [],
      });
    } catch (error) {
      setResult({ columns: [], rows: [] });

      setQueryError(
        error?.response?.data?.message || "Query execution failed."
      );
    }
  };

  const handleGetHint = async () => {
    setLoadingHint(true);

    try {
      const response = await getHint({ assignmentId: id, query });

      setHint(response.hint || "Try breaking the question into smaller steps.");
    } catch (_error) {
      setHint("Hint service unavailable. Check table names and SQL clauses.");
    } finally {
      setLoadingHint(false);
    }
  };

  if (loadingAssignment) {
    return (
      <main className="assignment-attempt-page">
        <p className="empty-state">Loading assignment...</p>
      </main>
    );
  }

  return (
    <main className="assignment-attempt-page">
      <header className="attempt-header">
        <button
          type="button"
          className="secondary-button"
          onClick={() => navigate("/")}
        >
          ← Back to Assignments
        </button>

        {assignment && (
          <div className="attempt-header__meta">
            <h1>{assignment.title}</h1>
            <span>{assignment.difficulty}</span>
          </div>
        )}
      </header>

      {assignment && (
        <section className="attempt-layout">
          <div className="panel question-panel">
            <h2>Question</h2>
            <p>{assignment.description}</p>
          </div>

          <div className="panel sample-panel">
            <h2>Schema + Sample Data</h2>
            <pre>{assignment.schema}</pre>
            <pre>{sampleDataString}</pre>
          </div>

          <div className="panel editor-panel">
            <h2>SQL Editor</h2>

            <SQLEditor value={query} onChange={setQuery} />

            <div className="editor-actions">
              <button
                type="button"
                className="primary-button"
                onClick={handleRunQuery}
              >
                Execute Query
              </button>

              <button
                type="button"
                className="secondary-button"
                onClick={() => setQuery("")}
              >
                Clear
              </button>
            </div>

            <HintBox
              hint={hint}
              loading={loadingHint}
              onGetHint={handleGetHint}
            />
          </div>

          <div className="panel result-panel">
            <h2>Result</h2>

            <ResultTable
              columns={result.columns}
              rows={result.rows}
              error={queryError}
            />
          </div>
        </section>
      )}
    </main>
  );
};

export default AssignmentAttempt;