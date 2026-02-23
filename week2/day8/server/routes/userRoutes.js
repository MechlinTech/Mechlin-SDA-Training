const express = require("express");
const router = express.Router();
const userService = require("../services/userService");
const authenticate = require("../middleware/auth");
const { authenticate, authorize } = require("../middleware/auth");

router.post("/register", async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const result = await userService.login(
      req.body.email,
      req.body.password
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get("/", authenticate, (req, res) => {
  res.json(userService.getAllUsers());
});

router.delete("/:id",
  authenticate,
  authorize("admin"),
  async (req, res) => {
    res.json({ message: "Only admin can delete users" });
});

module.exports = router;



