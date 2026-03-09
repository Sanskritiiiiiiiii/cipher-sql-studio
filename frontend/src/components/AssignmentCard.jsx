import React from "react";
import { useNavigate } from "react-router-dom";

const AssignmentCard = ({ assignment }) => {
const navigate = useNavigate();

return (
<article
className="assignment-card"
style={{
display: "flex",
flexDirection: "column",
height: "100%"
}}
> <div> <div className="assignment-card__meta"> <span className="assignment-card__difficulty">
{assignment.difficulty} </span> </div>

    <h2>{assignment.title}</h2>
    <p>{assignment.description}</p>
  </div>

  <button
    type="button"
    className="primary-button"
    style={{ marginTop: "auto" }}
    onClick={() => navigate(`/assignment/${assignment.id}`)}
  >
    Solve Assignment
  </button>
</article>

);
};

export default AssignmentCard;
