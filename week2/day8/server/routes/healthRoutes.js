const express = require("express");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Health
 *   description: Health monitoring endpoints
 */

/**
 * @swagger
 * /:
 *   get:
 *     summary: Root endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Server is running successfully
 */
router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Week 2 Day 9 Express Server is running 🚀",
  });
});

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health Check
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Server health information
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