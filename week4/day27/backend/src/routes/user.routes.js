/**
 * ----------------------------------------------------------
 * Protected User Routes
 * ----------------------------------------------------------
 * Used to verify JWT authentication.
 * ----------------------------------------------------------
 */

const express = require("express");

const router = express.Router();

const authenticateUser = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");

const {
  getProfile,
} = require("../controllers/user.controller");

// Logged-in user's profile
router.get("/profile", authenticateUser, getProfile);

// Admin-only route
router.get(
  "/admin",
  authenticateUser,
  authorizeRoles("admin"),
  (req, res) => {
    res.json({
      success: true,
      message: "Welcome Admin",
    });
  }
);

module.exports = router;