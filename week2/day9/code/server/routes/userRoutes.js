const express = require("express");
const {
  validateUser,
  validateLogin,
} = require("../middleware/validation");

const {
  authMiddleware,
  authorize,
  optionalAuth,
} = require("../middleware/auth");

const router = express.Router();


router.post("/register", validateUser, (req, res) => {
  res.status(201).json({
    success: true,
    message: "User registration endpoint",
    data: req.body,
  });
});


router.post("/login", validateLogin, (req, res) => {
  res.json({
    success: true,
    message: "User login endpoint",
  });
});


router.get("/profile", authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: "User profile endpoint",
    user: req.user,
  });
});


router.get(
  "/admin",
  authMiddleware,
  authorize("admin"),
  (req, res) => {
    res.json({
      success: true,
      message: "Admin route accessed successfully",
    });
  }
);


router.get("/optional", optionalAuth, (req, res) => {
  res.json({
    success: true,
    authenticated: !!req.user,
    user: req.user || null,
  });
});

module.exports = router;