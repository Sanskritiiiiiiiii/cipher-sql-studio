const { getMongoDb } = require("../config/mongo");
const { generateHint } = require("../utils/hintClient");

const buildFallbackHint = (assignment, query) => {
  if (!query || !query.trim()) {
    return `Start by identifying the main table for "${assignment.title}" and write a basic SELECT ... FROM query.`;
  }

  return "Check your SELECT columns, FROM table, and filtering or aggregation logic carefully.";
};

const getHint = async (req, res) => {
  const { assignmentId, query } = req.body;

  if (!assignmentId) {
    return res.status(400).json({ message: "assignmentId is required." });
  }

  const db = getMongoDb();

  const assignment = await db
    .collection("assignments")
    .findOne({ id: assignmentId }, { projection: { _id: 0 } });

  if (!assignment) {
    return res.status(404).json({ message: "Assignment not found." });
  }

  try {
    const hint = await generateHint({ assignment, query });
    res.json({ hint });
  } catch (error) {
    console.error("Hint generation failed:", error.message);
    res.json({ hint: buildFallbackHint(assignment, query) });
  }
};

module.exports = {
  getHint
};