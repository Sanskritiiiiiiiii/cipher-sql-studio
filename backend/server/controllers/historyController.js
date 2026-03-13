const {
  saveQueryAttempt,
  getQueryHistoryByAssignment,
} = require("../utils/queryHistory");

const saveHistory = async (req, res, next) => {
  const { assignmentId, queryText, executionStatus } = req.body;

  if (!assignmentId || !queryText || !executionStatus) {
    return next({
      statusCode: 400,
      message: "assignmentId, queryText, and executionStatus are required.",
    });
  }

  if (!["success", "error"].includes(executionStatus)) {
    return next({
      statusCode: 400,
      message: "executionStatus must be 'success' or 'error'.",
    });
  }

  try {
    const result = await saveQueryAttempt({
      assignmentId,
      queryText,
      executionStatus,
    });

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const getHistoryByAssignment = async (req, res, next) => {
  const { assignmentId } = req.params;

  try {
    const history = await getQueryHistoryByAssignment(assignmentId);
    res.json(history);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  saveHistory,
  getHistoryByAssignment,
};