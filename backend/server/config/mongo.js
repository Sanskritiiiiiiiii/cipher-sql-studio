const { MongoClient } = require("mongodb");

let mongoClient = null;
let mongoDb = null;

const connectMongo = async (mongoUrl, dbName) => {
  if (mongoDb) return mongoDb;

  mongoClient = new MongoClient(mongoUrl);
  await mongoClient.connect();
  mongoDb = mongoClient.db(dbName);

  return mongoDb;
};

const getMongoDb = () => {
  if (!mongoDb) {
    throw new Error("MongoDB not connected");
  }

  return mongoDb;
};

const closeMongo = async () => {
  if (mongoClient) {
    await mongoClient.close();
  }

  mongoClient = null;
  mongoDb = null;
};

module.exports = {
  connectMongo,
  getMongoDb,
  closeMongo,
};