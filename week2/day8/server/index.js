// Responsible for:
// Loading environment variables
// Creating the HTTP server
// Initializing Socket.IO
// Starting the application
// Handling graceful shutdown
// (Later) Adding cluster support

require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");

const app = require("./app");
const { connectPostgreSQL } = require("./database/postgresql");
const connectMongoDB = require("./database/mongodb");
const initializeSocket = require("./socket/socketHandler");
const notificationService = require("./services/notificationService");
const { logger } = require("./middleware/errorHandler");

const PORT = process.env.PORT || 3000;

/* -------------------------------------------------------------------------- */
/*                              Create HTTP Server                            */
/* -------------------------------------------------------------------------- */

const server = http.createServer(app);

/* -------------------------------------------------------------------------- */
/*                             Initialize Socket.IO                           */
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

initializeSocket(io);

/* -------------------------------------------------------------------------- */
/*                              Start Services                                */
/* -------------------------------------------------------------------------- */

notificationService.initialize();


/* -------------------------------------------------------------------------- */
/*                         Connect MongoDB                                    */
/* -------------------------------------------------------------------------- */

connectMongoDB();
connectPostgreSQL();
/* -------------------------------------------------------------------------- */
/*                               Start Server                                 */
/* -------------------------------------------------------------------------- */

server.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
  logger.info(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);

  console.log("=================================");
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment : ${process.env.NODE_ENV || "development"}`);
  console.log("=================================");
});

/* -------------------------------------------------------------------------- */
/*                           Graceful Shutdown                                */
/* -------------------------------------------------------------------------- */

process.on("SIGINT", () => {
  logger.info("Shutting down server...");

  server.close(() => {
    logger.info("HTTP Server Closed");
    process.exit(0);
  });
});

process.on("SIGTERM", () => {
  logger.info("SIGTERM received");

  server.close(() => {
    logger.info("HTTP Server Closed");
    process.exit(0);
  });
});