// Responsible for:
// Creating the Express app
// Registering middleware
// Registering routes
// Exporting the configured app

require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const compression = require("compression");
const rateLimit = require("express-rate-limit");

const performanceMiddleware = require("./middleware/performance");
const { errorHandler } = require("./middleware/errorHandler");

// Routes
const healthRoutes = require("./routes/healthRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

/* -------------------------------------------------------------------------- */
/*                           Security Middleware                              */
/* -------------------------------------------------------------------------- */

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5500",
    ],
    credentials: true,
  })
);

app.use(compression());

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      message: "Too many requests. Please try again later.",
    },
  })
);

/* -------------------------------------------------------------------------- */
/*                              Body Parsers                                  */
/* -------------------------------------------------------------------------- */

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

/* -------------------------------------------------------------------------- */
/*                          Custom Middleware                                 */
/* -------------------------------------------------------------------------- */

app.use(performanceMiddleware);

/* -------------------------------------------------------------------------- */
/*                                  Routes                                    */
/* -------------------------------------------------------------------------- */

app.use("/", healthRoutes);

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", authRoutes);
/* -------------------------------------------------------------------------- */
/*                              404 Handler                                   */
/* -------------------------------------------------------------------------- */
app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: "Route not found",
      path: req.originalUrl,
    });
  });

/* -------------------------------------------------------------------------- */
/*                            Global Error Handler                            */
/* -------------------------------------------------------------------------- */

app.use(errorHandler);

module.exports = app;