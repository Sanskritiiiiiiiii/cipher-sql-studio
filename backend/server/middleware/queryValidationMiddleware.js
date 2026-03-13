const DANGEROUS_SQL_MESSAGE =
  "Dangerous SQL commands are not allowed in the sandbox environment.";

const dangerousQueryPattern = /\b(drop|delete|alter|truncate)\b/i;

const validateSqlQuery = (req, res, next) => {
  const query = req.body?.query?.trim();

  if (!query) return next();

  if (dangerousQueryPattern.test(query)) {
    return res.status(400).json({ message: DANGEROUS_SQL_MESSAGE });
  }

  next();
};

module.exports = {
  validateSqlQuery,
  DANGEROUS_SQL_MESSAGE
};