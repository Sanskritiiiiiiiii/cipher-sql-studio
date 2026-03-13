const path = require("path");
const { spawn } = require("child_process");

const generateHint = (payload) => {
  return new Promise((resolve, reject) => {
    const workerPath = path.resolve(__dirname, "../controllers/hint_worker.py");

    const worker = spawn("python", [workerPath]);

    let stdout = "";
    let stderr = "";

    worker.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    worker.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    worker.on("close", (code) => {
      if (code !== 0) {
        return reject(new Error(stderr || "Hint worker failed"));
      }

      try {
        const result = JSON.parse(stdout);
        resolve(result.hint);
      } catch (err) {
        reject(new Error("Invalid hint response"));
      }
    });

    worker.stdin.write(JSON.stringify(payload));
    worker.stdin.end();
  });
};

module.exports = { generateHint };