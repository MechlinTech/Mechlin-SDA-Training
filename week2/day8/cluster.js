const cluster = require("cluster");
const os = require("os");

const totalCPUs = os.cpus().length;

if (cluster.isPrimary) {
  console.log("=================================");
  console.log(`🚀 Master Process Started`);
  console.log(`👑 Master PID : ${process.pid}`);
  console.log(`💻 CPU Cores  : ${totalCPUs}`);
  console.log("=================================");

  // Create one worker per CPU core
  for (let i = 0; i < totalCPUs; i++) {
    cluster.fork();
  }

  // Log when a worker comes online
  cluster.on("online", (worker) => {
    console.log(`✅ Worker ${worker.process.pid} is online`);
  });

  // Restart crashed workers
  cluster.on("exit", (worker, code, signal) => {
    console.log(
      `❌ Worker ${worker.process.pid} exited (code: ${code}, signal: ${signal})`
    );

    console.log("♻ Restarting worker...");

    cluster.fork();
  });
} else {
  console.log(`🚀 Worker ${process.pid} started`);

  // Start Express Application
  require("./server/index");
}