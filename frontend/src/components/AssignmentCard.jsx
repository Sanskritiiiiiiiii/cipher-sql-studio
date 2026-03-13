import React from "react";
import { useNavigate } from "react-router-dom";

const AssignmentCard = ({ assignment }) => {
  const navigate = useNavigate();

  return (
    <article className="assignment-card" data-testid={`assignment-card-${assignment.id}`}>
      <div className="assignment-card__meta">
        <span
          className="assignment-card__difficulty"
          data-testid={`assignment-difficulty-${assignment.id}`}
        >
          {assignment.difficulty}
        </span>
      </div>

      <h2 data-testid={`assignment-title-${assignment.id}`}>{assignment.title}</h2>

      <p data-testid={`assignment-description-${assignment.id}`}>
        {assignment.description}
      </p>

      <button
        type="button"
        className="primary-button"
        data-testid={`assignment-open-button-${assignment.id}`}
        onClick={() => navigate(`/assignment/${assignment.id}`)}
      >
        Solve Assignment
      </button>
    </article>
  );
};

export default AssignmentCard;