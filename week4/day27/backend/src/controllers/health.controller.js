/**
 * ==========================================================
 * File: controllers/health.controller.js
 * Purpose: Health Check Controller
 * ==========================================================
 *
 * This controller handles requests related to application
 * health.
 *
 * Responsibilities:
 * - Process incoming health check requests.
 * - Return server status information.
 *
 * Why Controller?
 * Controllers keep business logic separate from routing.
 * Routes only decide "where" requests go.
 * Controllers decide "what" happens.
 * ==========================================================
 */

const getHealth = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend is running successfully 🚀",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  });
};

module.exports = {
  getHealth,
};