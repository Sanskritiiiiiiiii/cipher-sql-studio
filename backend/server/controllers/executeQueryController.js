const { executeSandboxQuery } = require("../config/postgresSandbox");
const { saveQueryAttempt } = require("../utils/queryHistory");

const executeQuery = async (req, res, next) => {
const { assignmentId, query } = req.body;

if (!query || !query.trim()) {
return next({
statusCode: 400,
message: "Query cannot be empty.",
});
}

try {
// playground if no assignmentId
const result = await executeSandboxQuery(query, {
playground: !assignmentId,
});

// save success history
await saveQueryAttempt({
  assignmentId: assignmentId || null,
  queryText: query,
  executionStatus: "success",
}).catch(() => {});

return res.json(result);

} catch (error) {
// save failed attempt
await saveQueryAttempt({
assignmentId: assignmentId || null,
queryText: query,
executionStatus: "error",
}).catch(() => {});

return next({
  statusCode: 500,
  message: error.message || "Query execution failed.",
});

}
};

module.exports = {
executeQuery,
};
