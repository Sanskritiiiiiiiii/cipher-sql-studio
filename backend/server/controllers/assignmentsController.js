const { getMongoDb } = require("../config/mongo");

const getAssignments = async (_req, res) => {
  const db = getMongoDb();

  const assignments = await db
    .collection("assignments")
    .find({}, { projection: { _id: 0 } })
    .toArray();

  res.json(assignments);
};

const getAssignmentById = async (req, res) => {
  const db = getMongoDb();

  const assignment = await db
    .collection("assignments")
    .findOne({ id: req.params.id }, { projection: { _id: 0 } });

  if (!assignment) {
    return res.status(404).json({ message: "Assignment not found." });
  }

  res.json(assignment);
};

module.exports = {
  getAssignments,
  getAssignmentById,
};