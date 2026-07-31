/**
 * ==========================================================
 * File: routes/index.js
 * Purpose: Central Route Manager
 * ==========================================================
 *
 * This file acts as the main entry point for all application
 * routes. Instead of registering every route directly inside
 * app.js, we organize them here for better scalability.
 *
 * Responsibilities:
 * - Import all feature routes.
 * - Register routes with their base paths.
 * - Export a single router instance to app.js.
 *
 * Route Structure:
 *
 * /api
 *   ├── /health
 *   ├── /auth
 *   └── /ai
 *
 * Benefits:
 * - Cleaner app.js
 * - Easy maintenance
 * - Modular architecture
 * - Easier to add new APIs
 * ==========================================================
 */

/**
 * ==========================================================
 * File: routes/index.js
 * Purpose: Central Route Manager
 * ==========================================================
 */

const express = require("express");

const healthRoutes = require("./health.routes");

// These routes will be added later
const authRoutes = require("./auth.routes");
const aiRoutes = require("./ai.routes");
const taskRoutes = require("./task.routes");
const userRoutes = require("./user.routes");
const router = express.Router();
const analyticsRoutes = require("./analytics.routes");



router.use("/health", healthRoutes);
router.use("/tasks", taskRoutes);
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/ai", aiRoutes);
router.use("/analytics", analyticsRoutes);

module.exports = router;