require('dotenv').config();
const express = require("express");
const app = express();

const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const auth = require('./middleware/auth');

const logger = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");

const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');

const http = require('http');
const { Server } = require('socket.io');

const connectDB = require('./config/db');
connectDB();

const PORT = process.env.PORT || 3000;

// GLOBAL MIDDLEWARE
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(logger);

// performance monitoring middleware
app.use((req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    console.log(`${req.method} ${req.url} - ${Date.now() - start}ms`);
  });

  next();
});


// ROUTES

// public auth routes
app.use('/api/auth', authRoutes);

// protected user routes
app.use('/api/users', auth, userRoutes);

// base route
app.get('/', (req, res) => {
  res.send("Server is running");
});

// health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    uptime: process.uptime()
  });
});

// 404 HANDLER
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// ERROR HANDLER (LAST)
app.use(errorHandler);

// SERVER
const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('message', (msg) => {
    io.emit('message', msg);
  });
});

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

process.on('SIGINT', () => {
  console.log('Shutting down...');
  process.exit(0);
});
