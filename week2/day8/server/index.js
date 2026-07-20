// ============================================================================
// Server Entry Point
// ============================================================================
//
// Responsibilities:
// - Load environment variables
// - Create HTTP server
// - Initialize Socket.IO
// - Start background services
// - Start Express application
// - Handle graceful shutdown
//
// NOTE:
// All API routes are registered inside app.js.
// This file is responsible only for bootstrapping the server.
//
// ============================================================================

require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");

const app = require("./app");

const initializeSocket = require("./socket/socketHandler");
const notificationService = require("./services/notificationService");
const { logger } = require("./middleware/errorHandler");
const connectMongoDB = require("./database/mongodb");
const PORT = process.env.PORT || 3000;

/* -------------------------------------------------------------------------- */
/*                            Create HTTP Server                              */
/* -------------------------------------------------------------------------- */

const server = http.createServer(app);

/* -------------------------------------------------------------------------- */
/*                           Initialize Socket.IO                             */
/* -------------------------------------------------------------------------- */

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5500",
    ],
    credentials: true,
  },
});

// Register socket events
initializeSocket(io);

/* -------------------------------------------------------------------------- */
/*                         Initialize Background Services                      */
/* -------------------------------------------------------------------------- */

// Start notification service
notificationService.initialize();

async function startServer() {
  try {
    await connectMongoDB();

    server.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
      logger.info(
        `🌍 Environment: ${process.env.NODE_ENV || "development"}`
      );

      console.log("=================================");
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(
        `🌍 Environment : ${process.env.NODE_ENV || "development"}`
      );
      console.log("=================================");
    });
  } catch (error) {
    logger.error(error);
    console.error(error);
    process.exit(1);
  }
}

startServer();


// start server hataya 

/* -------------------------------------------------------------------------- */
/*                           Graceful Shutdown                                */
/* -------------------------------------------------------------------------- */

const gracefulShutdown = (signal) => {
  logger.info(`${signal} received. Shutting down server...`);

  server.close(() => {
    logger.info("✅ HTTP Server Closed Successfully");
    process.exit(0);
  });
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));