const path = require("path");
const express = require("express");
const cors = require("cors");

const { connectMongo, closeMongo } = require("./config/mongo");
const { env } = require("./config/env");
const { seedTables } = require("./config/postgresSandbox");
const { seedAssignments } = require("./config/seedAssignments");
const assignmentsRoutes = require("./routes/assignments");
const executeQueryRoutes = require("./routes/executeQuery");
const hintRoutes = require("./routes/hint");
const historyRoutes = require("./routes/history");
const { notFoundHandler } = require("./middleware/notFoundMiddleware");
const { errorHandler } = require("./middleware/errorHandler");

require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "node-express", postgresUri: env.postgresUri });
});

app.get("/api", (_req, res) => {
  res.json({ message: "CipherSQLStudio API is live." });
});

app.use("/api/assignments", assignmentsRoutes);
app.use("/api/execute", executeQueryRoutes);
app.use("/api/hint", hintRoutes);
app.use("/api/history", historyRoutes);

app.use("/api/*", notFoundHandler);
app.use(errorHandler);

const startServer = async () => {
  try {
    await connectMongo(env.mongoUri, env.dbName);
    await seedTables();
    await seedAssignments();

    app.listen(env.port, () => {
      console.log(`CipherSQLStudio Node API running at http://127.0.0.1:${env.port}`);
    });
  } catch (error) {
    console.error("Server startup error:", error.message);
    process.exit(1);
  }
};

process.on("SIGTERM", async () => {
  await closeMongo();
  process.exit(0);
});

process.on("SIGINT", async () => {
  await closeMongo();
  process.exit(0);
});

startServer();
