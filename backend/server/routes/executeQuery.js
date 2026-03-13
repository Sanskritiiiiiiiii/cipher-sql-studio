const { executeSandboxQuery } = require("../config/postgresSandbox");
const { saveQueryAttempt } = require("../utils/queryHistory");

const executeQuery = async (req, res, next) => {
const { assignmentId, query } = req.body;

if (!query || !query.trim()) {
return res.status(400).json({
message: "Query cannot be empty."
});
}

try {

// Split multiple SQL statements
const statements = query
  .split(";")
  .map((q) => q.trim())
  .filter(Boolean);

let finalResult = { rows: [], columns: [] };

for (const statement of statements) {

  const result = await executeSandboxQuery(statement);

  // Only capture SELECT result
  if (result?.rows) {
    finalResult.rows = result.rows;
    finalResult.columns = result.fields
      ? result.fields.map((f) => f.name)
      : [];
  }

}

// Save history if assignment
if (assignmentId) {
  await saveQueryAttempt({
    assignmentId,
    query,
    executionStatus: "success"
  });
}

res.json(finalResult);

} catch (error) {

if (assignmentId) {
  await saveQueryAttempt({
    assignmentId,
    query,
    executionStatus: "error"
  });
}

res.status(400).json({
  message: error.message || "Query execution failed."
});

}
};

module.exports = 
executeQuery
;
