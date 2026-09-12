const express = require("express");
const cluster = require("cluster");
const os = require("os");
const { createServer } = require("http");
const { Server } = require("socket.io");

const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");


const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const healthRoutes = require("./routes/healthRoutes");

const UserService = require("./services/userService");
const ProductService = require("./services/productService");
const OrderService = require("./services/orderService");
const NotificationService = require("./services/notificationService");


const {errorHandler} = require("./middleware/errorHandler");
const logger = require("./middleware/logger");
const {performanceMiddleware} = require("./middleware/performance");


class Application {
  constructor() {
    this.app = express();

    this.httpServer = createServer(this.app);

    this.io = new Server(this.httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      },
    });

    this.userService = new UserService();
    this.productService = new ProductService();
    this.orderService = new OrderService();
    this.notificationService = new NotificationService();

    this.port = process.env.PORT || 3000;
  }


  setupMiddleware() {
    this.app.use(helmet());

    this.app.use(
      cors({
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        credentials: true,
      })
    );

    this.app.use(compression());

    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
      message: "Too many requests from this IP, please try again later.",
    });

    this.app.use("/api/", limiter);

    this.app.use(
      express.json({
        limit: "10mb",
      })
    );

    this.app.use(
      express.urlencoded({
        extended: true,
        limit: "10mb",
      })
    );

    this.app.use(logger);
    this.app.use(performanceMiddleware);
  }


  
  setupRoutes() {
 
    this.app.use("/health", healthRoutes);

    
    this.app.use(
      "/api/users",
      userRoutes(this.userService)
    );

    this.app.use(
      "/api/products",
      productRoutes(this.productService)
    );

   
    this.app.use(
      "/api/orders",
      orderRoutes(this.orderService)
    );

   
    this.app.post("/api/auth/login", async (req, res, next) => {
      try {
        const { email, password } = req.body;

        const result =
          await this.userService.authenticateUser(
            email,
            password
          );

        res.json({
          success: true,
          data: result,
        });
      } catch (error) {
        next(error);
      }
    });

   
    this.app.use((req, res) => {
      res.status(404).json({
        success: false,
        error: "Route not found",
      });
    });
  }


  async initializeServices() {
    await this.userService.initialize();
    await this.productService.initialize();
    await this.orderService.initialize();
    await this.notificationService.initialize();

   
    this.userService.on("userCreated", (user) => {
      console.log("User created:", user.email);
    });

   
    this.productService.on("productCreated", (product) => {
      console.log("Product created:", product.name);
    });

    this.orderService.on("orderCreated", (order) => {
      console.log("Order created:", order.id);
    });

    this.notificationService.on(
      "notificationCreated",
      (notification) => {
        console.log(
          "Notification created:",
          notification.id
        );
      }
    );

    console.log("All services initialized successfully");
  }

  setupWebSocket() {
    this.io.on("connection", (socket) => {
      console.log(`Client connected: ${socket.id}`);

      socket.on("join", (room) => {
        socket.join(room);

        console.log(
          `Client ${socket.id} joined room ${room}`
        );
      });

      socket.on("user:update", (data) => {
        socket.broadcast.emit(
          "user:updated",
          data
        );
      });

      socket.on("disconnect", () => {
        console.log(
          `Client disconnected: ${socket.id}`
        );
      });
    });
  }


  
  setupErrorHandling() {
    this.app.use(errorHandler);

    process.on("unhandledRejection", (reason) => {
      console.error(
        "Unhandled Rejection:",
        reason
      );
    });

    process.on("uncaughtException", (error) => {
      console.error(
        "Uncaught Exception:",
        error
      );
    });
  }


  startServer() {
    this.httpServer.listen(this.port, () => {
      console.log(
        `Server running on port ${this.port}`
      );

      console.log(
        `Process ID: ${process.pid}`
      );

      console.log(
        `Environment: ${
          process.env.NODE_ENV || "development"
        }`
      );
    });
  }


  async initialize() {
    this.setupMiddleware();
    this.setupRoutes();
    this.setupWebSocket();
    this.setupErrorHandling();

    await this.initializeServices();

    this.startServer();
  }
}


if (cluster.isPrimary) {
  const numCPUs = os.cpus().length;

  console.log(
    `Master process ${process.pid} is running`
  );

  console.log(
    `Starting ${numCPUs} workers`
  );

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker) => {
    console.log(
      `Worker ${worker.process.pid} died`
    );

    console.log(
      "Starting a new worker"
    );

    cluster.fork();
  });

} else {

  const app = new Application();

  app.initialize().catch((error) => {
    console.error(
      "Application initialization failed:",
      error
    );

    process.exit(1);
  });
}