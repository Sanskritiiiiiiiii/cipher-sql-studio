const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const requiredEnvVars = [
  "PORT",
  "POSTGRES_URI",
  "MONGO_URI",
  "LLM_API_KEY",
  "DB_NAME",
  "CORS_ORIGINS",
  "PYTHON_BIN",
];

const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingEnvVars.join(", ")}`);
}

const parsedPort = Number(process.env.PORT);
if (!Number.isInteger(parsedPort) || parsedPort <= 0) {
  throw new Error("PORT must be a valid positive integer.");
}

const env = {
  port: parsedPort,
  postgresUri: process.env.POSTGRES_URI,
  mongoUri: process.env.MONGO_URI,
  dbName: process.env.DB_NAME,
  corsOrigins: process.env.CORS_ORIGINS,
  llmApiKey: process.env.LLM_API_KEY,
  pythonBin: process.env.PYTHON_BIN,
};

module.exports = {
  env,
};
