const path = require("path");
const { spawn } = require("child_process");

const generateHint = (payload) => {
  return new Promise((resolve, reject) => {
    const workerPath = path.resolve(__dirname, "../controllers/hint_worker.py");
    const pythonBin = "python";

    const worker = spawn(pythonBin, [workerPath]);

    let stdout = "";
    let stderr = "";

    worker.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });

    worker.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    worker.on("close", (code) => {
      if (code !== 0) {
        return reject(new Error(stderr || "Hint generation failed"));
      }

      try {
        const parsed = JSON.parse(stdout);
        if (!parsed.hint) {
          return reject(new Error("Invalid hint response"));
        }
        resolve(parsed.hint);
      } catch {
        reject(new Error("Invalid hint response"));
      }
    });

    worker.stdin.write(JSON.stringify(payload));
    worker.stdin.end();
  });
};

module.exports = {
  generateHint,
};