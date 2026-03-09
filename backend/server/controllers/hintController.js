const { getMongoDb } = require("../config/mongo");
const { generateHint } = require("../utils/hintClient");

const buildFallbackHint = (assignment, queryText) => {
  if (!queryText || !queryText.trim()) {
    return `Start with a basic SELECT query for "${assignment.title}".`;
  }

  return "Check your SELECT columns, FROM table, and WHERE conditions.";
};

const getHint = async (req, res) => {
  const { assignmentId, query } = req.body;

  if (!assignmentId) {
    return res.status(400).json({ message: "assignmentId is required." });
  }

  const db = getMongoDb();
  const assignmentsCollection = db.collection("assignments");

  const assignment = await assignmentsCollection.findOne({ id: assignmentId });

  if (!assignment) {
    return res.status(404).json({ message: "Assignment not found." });
  }

  try {
    const hint = await generateHint({ assignment, query });
    res.json({ hint });
  } catch (error) {
    console.error("Hint error:", error.message);
    const fallbackHint = buildFallbackHint(assignment, query);
    res.json({ hint: fallbackHint });
  }
};

module.exports = {
  getHint,
};