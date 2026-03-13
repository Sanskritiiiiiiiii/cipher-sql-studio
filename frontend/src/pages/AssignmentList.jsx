import React, { useEffect, useState } from "react";
import AssignmentCard from "@/components/AssignmentCard";
import { getAssignments } from "@/services/api";
import { Link } from "react-router-dom";

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

return ( <main className="assignment-list-page"> <section className="hero-panel"> <p className="hero-badge">CipherSQLStudio</p>


    <h1>Practice SQL in a clean sandbox</h1>

    <p className="hero-description">
      Write SQL from scratch in the playground, experiment with queries,
      and use assignments as practice challenges.
    </p>

    <div className="hero-actions">
      <Link to="/playground" className="playground-button">
        🚀 Open SQL Playground
      </Link>
    </div>

    <p className="hero-secondary">
      or try the assignments below
    </p>
  </section>

  {loading && (
    <p className="empty-state">
      Loading assignments...
    </p>
  )}

  {error && (
    <p className="error-box">
      {error}
    </p>
  )}

  {!loading && !error && (
    <section className="assignment-grid">
      {assignments.map((assignment) => (
        <AssignmentCard
          key={assignment.id}
          assignment={assignment}
        />
      ))}
    </section>
  )}
</main>

);
};

export default AssignmentList;
