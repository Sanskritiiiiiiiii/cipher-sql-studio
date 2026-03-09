const { getMongoDb } = require("../config/mongo");
const { executeSandboxQuery } = require("../config/postgresSandbox");

const sanitizeSqlErrorMessage = () => {
  return "Invalid SQL query. Please check syntax, table names, and column names.";
};

const executeQuery = async (req, res) => {
  const { assignmentId, query } = req.body;

  if (!query || !query.trim()) {
    return res.status(400).json({ message: "Query cannot be empty." });
  }

  const db = getMongoDb();
  const attemptsCollection = db.collection("attempts");

  try {
    const result = await executeSandboxQuery(query);

    const attemptDoc = {
      assignmentId: assignmentId || null,
      query,
      success: true,
      rowCount: result.rowCount,
      resultPreview: result.rows.slice(0, 5),
      createdAt: new Date().toISOString(),
    };

    await attemptsCollection.insertOne(attemptDoc);

    res.json(result);
  } catch (error) {
    const userSafeMessage = sanitizeSqlErrorMessage();

    const attemptDoc = {
      assignmentId: assignmentId || null,
      query,
      success: false,
      error: error.message,
      createdAt: new Date().toISOString(),
    };

    await attemptsCollection.insertOne(attemptDoc);

    res.status(400).json({ message: userSafeMessage });
  }
};

module.exports = {
  executeQuery,
};