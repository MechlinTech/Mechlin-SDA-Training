/**
 * ==========================================================
 * File: routes/health.routes.js
 * Purpose: Health Check Routes
 * ==========================================================
 *
 * This file defines endpoints used to verify that the backend
 * server is running correctly.
 *
 * Responsibilities:
 * - Handle health-related API requests.
 * - Delegate request handling to the controller.
 *
 * Endpoints:
 * GET /api/health
 *
 * Why is this important?
 * - Used by developers to check server status.
 * - Used by Docker, Kubernetes and Load Balancers.
 * - Helps monitoring tools determine whether the service
 *   is healthy.
 * ==========================================================
 */

const express = require("express");
const router = express.Router();

const { getHealth } = require("../controllers/health.controller");

router.get("/", getHealth);

module.exports = router;