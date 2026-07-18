// Responsible for:
// Loading environment variables
// Creating the HTTP server
// Initializing Socket.IO
// Starting the application
// Handling graceful shutdown
// (Later) Adding cluster support

require("dotenv").config();

const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const notificationService = require("./services/notificationService");
const performanceMiddleware = require("./middleware/performance");
const { errorHandler } = require("./middleware/errorHandler");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const initializeSocket = require("./socket/socketHandler");
const helmet = require("helmet");
const cors = require("cors");
const compression = require("compression");
const rateLimit = require("express-rate-limit");

const app = express();
const server = http.createServer(app);

// Socket.IO server for real-time communication
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5500",
    ],
    credentials: true,
  },
});
initializeSocket(io);// Initialize all Socket.IO events

const PORT = process.env.PORT || 3000;

/* -------------------------------------------------------------------------- */
/*                               Global Middleware                            */
/* -------------------------------------------------------------------------- */

// Secure HTTP headers
app.use(helmet());

// Enable Cross-Origin Resource Sharing
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5500",
    ],
    credentials: true,
  })
);

// Compress API responses
app.use(compression());

// Prevent API abuse
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests. Please try again later.",
  })
);

// Parse incoming request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(performanceMiddleware);

/* -------------------------------------------------------------------------- */
/*                                   Routes                                   */
/* -------------------------------------------------------------------------- */

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

app.use(errorHandler);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Week 2 Day 8 Node.js Server is running 🚀",
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

/* -------------------------------------------------------------------------- */
/*                                 Web Socket                                 */
/* -------------------------------------------------------------------------- */

// io.on("connection", (socket) => {
//   console.log(`Client connected : ${socket.id}`);

//   socket.on("disconnect", () => {
//     console.log(`Client disconnected : ${socket.id}`);
//   });
// });

// Global error handler should be the last middleware
// app.use(errorHandler);
/* -------------------------------------------------------------------------- */
/*                               Start Server                                 */
/* -------------------------------------------------------------------------- */

server.listen(PORT, () => {
    notificationService.initialize();
  console.log("=================================");
  logger.info(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment : ${process.env.NODE_ENV}`);
  console.log("=================================");
});