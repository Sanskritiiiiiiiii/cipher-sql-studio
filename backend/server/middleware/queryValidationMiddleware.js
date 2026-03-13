const DANGEROUS_SQL_MESSAGE =
"Dangerous SQL commands are not allowed in the sandbox environment.";

const MULTIPLE_STATEMENTS_MESSAGE =
"Only one SQL statement is allowed for assignment queries.";

const dangerousQueryPattern = /\b(drop|delete|alter|truncate)\b/i;

const validateSqlQuery = (req, res, next) => {
const query = req.body?.query?.trim();

if (!query) return next();

/* Block dangerous commands */
if (dangerousQueryPattern.test(query)) {
return res.status(400).json({ message: DANGEROUS_SQL_MESSAGE });
}

/*
Assignment Mode → Only one query allowed
Playground Mode → Multiple queries allowed
*/

const executionMode = req.executionMode || "assignment";

if (executionMode === "assignment") {
const statements = query
.split(";")
.map((s) => s.trim())
.filter(Boolean);

if (statements.length > 1) {
  return res
    .status(400)
    .json({ message: MULTIPLE_STATEMENTS_MESSAGE });
}
}

next();
};

module.exports = {
validateSqlQuery,
DANGEROUS_SQL_MESSAGE
};
