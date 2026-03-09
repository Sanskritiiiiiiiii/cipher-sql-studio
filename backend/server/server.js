const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const { connectMongo, closeMongo } = require("./config/mongo");
const { seedTables } = require("./config/postgresSandbox");
const { seedAssignments } = require("./config/seedAssignments");

const assignmentsRoutes = require("./routes/assignments");
const executeQueryRoutes = require("./routes/executeQuery");
const hintRoutes = require("./routes/hint");

dotenv.config();

const app = express();
const port = process.env.PORT || 8002;

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/api", (_req, res) => {
  res.json({ message: "CipherSQLStudio API is live." });
});

app.use("/api/assignments", assignmentsRoutes);
app.use("/api/execute", executeQueryRoutes);
app.use("/api/hint", hintRoutes);

app.use("/api/*", (_req, res) => {
  res.status(404).json({ message: "API route not found." });
});

const startServer = async () => {
  try {
    await connectMongo(process.env.MONGO_URL, process.env.DB_NAME);
    await seedTables();
    await seedAssignments();

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
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