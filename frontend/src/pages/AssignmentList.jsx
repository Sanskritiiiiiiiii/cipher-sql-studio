import React, { useEffect, useState } from "react";
import AssignmentCard from "@/components/AssignmentCard";
import { getAssignments } from "@/services/api";

const AssignmentList = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAssignments = async () => {
      try {
        const data = await getAssignments();
        setAssignments(data);
      } catch (_error) {
        setError("Failed to load assignments. Please refresh.");
      } finally {
        setLoading(false);
      }
    };

    loadAssignments();
  }, []);

  return (
    <main className="assignment-list-page" data-testid="assignment-list-page">
      <section className="hero-panel" data-testid="assignment-list-hero">
        <p data-testid="app-badge">CipherSQLStudio</p>
        <h1 data-testid="app-main-heading">Practice SQL in a clean sandbox</h1>
        <p data-testid="app-sub-heading">
          Pick an assignment, write your SQL, run it instantly, and use AI hints
          when you get stuck.
        </p>
      </section>

      {loading && (
        <p className="empty-state" data-testid="assignment-loading-message">
          Loading assignments...
        </p>
      )}

      {error && (
        <p className="error-box" data-testid="assignment-error-message">
          {error}
        </p>
      )}

      {!loading && !error && (
        <section className="assignment-grid" data-testid="assignment-list-grid">
          {assignments.map((assignment) => (
            <AssignmentCard key={assignment.id} assignment={assignment} />
          ))}
        </section>
      )}
    </main>
  );
};

export default AssignmentList;
