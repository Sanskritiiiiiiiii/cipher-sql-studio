const mapDatabaseErrorMessage = (message = "") => {
  const msg = message.toLowerCase();

  if (msg.includes("syntax error") || msg.includes("at or near")) {
    return "SQL syntax error. Check your SELECT statement.";
  }

  if (msg.includes("relation") && msg.includes("does not exist")) {
    return "Table not found. Please check the table name.";
  }

  if (msg.includes("column") && msg.includes("does not exist")) {
    return "Column not found. Please check the column names.";
  }

  return "Query execution failed. Please review your SQL and try again.";
};

const errorHandler = (error, req, res, next) => {
  if (res.headersSent) return next(error);

  const message = error?.message || "Unexpected server error.";

  const badRequestMessages = [
    "Query cannot be empty.",
    "Only one SQL statement is allowed per execution.",
    "Transaction control commands are not allowed in this sandbox."
  ];

  if (badRequestMessages.includes(message)) {
    return res.status(400).json({ message });
  }

  if (error?.statusCode) {
    return res.status(error.statusCode).json({ message });
  }

  if (error?.isDatabaseError !== false) {
    return res.status(400).json({
      message: mapDatabaseErrorMessage(message)
    });
  }

  return res.status(500).json({
    message: "Server error. Please try again later."
  });
};

module.exports = { errorHandler };