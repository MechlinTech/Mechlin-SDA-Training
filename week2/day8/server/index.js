const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const cluster = require("cluster");
const os = require("os");

const userRoutes = require("./routes/userRoutes");
const errorHandler = require("./middleware/errorHandler");
const performanceMiddleware = require("./middleware/performance");

const PORT = 5000;

function createServer() {
  const app = express();

  // Security middleware
  app.use(helmet());
  app.use(cors());
  app.use(compression());

  // Body parsing
  app.use(express.json());

  // Performance monitoring
  app.use(performanceMiddleware);

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
  });
  app.use("/api", limiter);

  // Routes
  app.use("/api/users", userRoutes);

  // Root test route
  app.get("/", (req, res) => {
    res.json({ message: "Clustered Node Server Running 🚀" });
  });

  // Error handler
  app.use(errorHandler);

  return app;
}

if (cluster.isPrimary) {
  const numCPUs = os.cpus().length;
  console.log(`Primary ${process.pid} is running`);
  console.log(`Forking ${numCPUs} workers...`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker) => {
    console.log(`Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });

} else {
  const app = createServer();

  app.listen(PORT, () => {
    console.log(`Worker ${process.pid} running on port ${PORT}`);
  });
}