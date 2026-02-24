const express = require("express");
const router = express.Router();
const userService = require("../services/userService");
const { authMiddleware, authorize } = require("../middleware/auth");
const { body } = require("express-validator");
const { handleValidation } = require("../middleware/validation");

// REGISTER
router.post(
  "/register",
  [
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
  ],
  handleValidation,
  async (req, res, next) => {
    try {
      const user = await userService.createUser(req.body);
      res.status(201).json(user);
    } catch (err) {
      next(err);
    }
  }
);

// LOGIN
router.post("/login", async (req, res, next) => {
  try {
    const result = await userService.authenticateUser(
      req.body.email,
      req.body.password
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// PROTECTED ROUTE
router.get("/", authMiddleware, authorize("admin"), async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (err) {
    next(err);
  }
});

module.exports = router;