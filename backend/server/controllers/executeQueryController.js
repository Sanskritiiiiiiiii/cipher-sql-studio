const { executeSandboxQuery } = require("../config/postgresSandbox");
const { saveQueryAttempt } = require("../utils/queryHistory");

const executeQuery = async (req, res, next) => {
  const { assignmentId, query } = req.body;

  if (!query || !query.trim()) {
    return next({ statusCode: 400, message: "Query cannot be empty." });
  }

  try {
    const result = await executeSandboxQuery(query);

    await saveQueryAttempt({
      assignmentId: assignmentId || null,
      queryText: query,
      executionStatus: "success",
    });

    res.json(result);
  } catch (error) {
    await saveQueryAttempt({
      assignmentId: assignmentId || null,
      queryText: query,
      executionStatus: "error",
    }).catch(() => {});

    next(error);
  }
};

module.exports = {
  executeQuery
};