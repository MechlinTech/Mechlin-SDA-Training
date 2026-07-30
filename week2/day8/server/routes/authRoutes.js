const express = require("express");

const router = express.Router();

const authController = require("../controllers/authController");

const {
  authenticate,
} = require("../middleware/auth");

const {
  authorize,
} = require("../middleware/rbac");

/**
 * ============================================================
 * Public Routes
 * ============================================================
 */

// Register
router.post("/register", authController.register);

// Login
router.post("/login", authController.login);

// Refresh Access Token
router.post("/refresh", authController.refreshToken);

/**
 * ============================================================
 * Protected Routes
 * ============================================================
 */

// Logged-in user profile
router.get(
  "/profile",
  authenticate,
  authController.profile
);

// Change Password
router.put(
  "/change-password",
  authenticate,
  authController.changePassword
);

// Logout
router.post(
  "/logout",
  authenticate,
  authController.logout
);

/**
 * ============================================================
 * Admin Only Example
 * ============================================================
 */

router.get(
  "/admin",
  authenticate,
  authorize("admin"),
  (req, res) => {
    res.json({
      success: true,
      message: "Welcome Admin",
    });
  }
);

module.exports = router;