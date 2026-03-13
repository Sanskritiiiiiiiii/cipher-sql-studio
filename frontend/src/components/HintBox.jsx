import React from "react";

const HintBox = ({ hint, loading, onGetHint }) => {
  return (
    <section className="hint-box">
      <div className="hint-box__header">
        <h3>AI Hint</h3>

        <button
          type="button"
          className="secondary-button"
          onClick={onGetHint}
          disabled={loading}
        >
          {loading ? "Getting Hint..." : "Get Hint"}
        </button>
      </div>

      <p>
        {hint || "Click 'Get Hint' to receive a directional tip (no full answer)."}
      </p>
    </section>
  );
};

export default HintBox;