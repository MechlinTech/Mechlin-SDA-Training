const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");

const userRoutes = require("./routes/userRoutes");
const { errorHandler } = require("./middleware/errorHandler");
const performanceMiddleware = require("./middleware/performance");

class ExpressApp {
  constructor() {
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  setupMiddleware() {
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(compression());
    this.app.use(express.json());

    this.app.use(morgan("dev"));
    this.app.use(performanceMiddleware);

    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
    });

    this.app.use("/api/", limiter);
  }

  setupRoutes() {
    this.app.get("/health", (req, res) => {
      res.json({
        status: "OK",
        uptime: process.uptime(),
        timestamp: new Date(),
      });
    });

    this.app.use("/api/users", userRoutes);

    this.app.use((req, res) => {
        res.status(404).json({
            success: false,
            message: "Route not found",
            path: req.originalUrl
        });
    });
  }

  setupErrorHandling() {
    this.app.use(errorHandler);
  }

  start(port) {
    this.app.listen(port, () => {
      console.log(`Worker ${process.pid} running on port ${port}`);
    });
  }
}

module.exports = ExpressApp;