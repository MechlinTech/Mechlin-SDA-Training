const express = require("express");
const { getPerformanceMetrics } = require("../middleware/performance");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    success: true,
    status: "healthy",
    service: "SDA Multi-Service Node.js Application",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    metrics: getPerformanceMetrics(),
  });
});

module.exports = router;