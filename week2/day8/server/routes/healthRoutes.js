const express = require("express");

const router = express.Router();

/**
 * Root Route
 */
router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Week 2 Day 9 Express Server is running 🚀",
  });
});

/**
 * Health Check Route
 */
router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    memory: process.memoryUsage(),
    nodeVersion: process.version,
    environment: process.env.NODE_ENV || "development",
  });
});

module.exports = router;