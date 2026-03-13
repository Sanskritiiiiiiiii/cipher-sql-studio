const { getMongoDb } = require("../config/mongo");

const HISTORY_LIMIT = 10;

const saveQueryAttempt = async ({ assignmentId, queryText, executionStatus }) => {
  const db = getMongoDb();
  const historyCollection = db.collection("query_history");

  const historyDoc = {
    assignmentId,
    queryText,
    executionStatus,
    timestamp: new Date(),
  };

  await historyCollection.insertOne(historyDoc);

  return {
    assignmentId,
    queryText,
    executionStatus,
    timestamp: historyDoc.timestamp,
  };
};

const getQueryHistoryByAssignment = async (assignmentId) => {
  const db = getMongoDb();
  const historyCollection = db.collection("query_history");

  const history = await historyCollection
    .find({ assignmentId }, { projection: { _id: 0 } })
    .sort({ timestamp: -1 })
    .limit(HISTORY_LIMIT)
    .toArray();

  return history;
};

module.exports = {
  saveQueryAttempt,
  getQueryHistoryByAssignment,
};