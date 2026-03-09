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
    <main className="assignment-list-page">
      <section className="hero-panel">
        <p>CipherSQLStudio</p>
        <h1>Practice SQL queries in a sandbox environment</h1>
        <p>
          Choose an assignment, write a query, run it, and get hints if needed.
        </p>
      </section>

      {loading && <p className="empty-state">Loading assignments...</p>}

      {error && <p className="error-box">{error}</p>}

      {!loading && !error && (
        <section className="assignment-grid">
          {assignments.map((assignment) => (
            <AssignmentCard key={assignment.id} assignment={assignment} />
          ))}
        </section>
      )}
    </main>
  );
};

export default AssignmentList;