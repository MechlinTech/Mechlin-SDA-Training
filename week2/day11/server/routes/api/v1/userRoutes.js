const express = require("express");
const router = express.Router();
const { AppError } = require("../../../middleware/errorHandler");
const asyncHandler = require("../../../utils/asyncHandler");
const cacheMiddleware = require("../../../middleware/cache");
const loginLimiter = require("../../../middleware/loginLimiter");

let users = []; // temporary in-memory storage

// GET all users
router.get(
  "/",
  cacheMiddleware(60),
  asyncHandler(async (req, res) => {
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  })
);

// GET single user
router.get("/:id", 
    cacheMiddleware(60),
    asyncHandler(async (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));

  if (!user) {
        return next(new AppError("User not found", 404));
  }

  res.status(200).json({
    success: true,
    data: user
  });
})
);

// CREATE user
router.post("/login", loginLimiter, async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return next(new AppError("Name and email are required", 404));
  }

  const newUser = {
    id: users.length + 1,
    name,
    email
  };

  users.push(newUser);

  res.status(201).json({
    success: true,
    data: newUser
  });
});

// UPDATE user
router.put("/:id", (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;

  res.status(200).json({
    success: true,
    data: user
  });
});

// DELETE user
router.delete("/:id", (req, res) => {
  const index = users.findIndex(u => u.id === parseInt(req.params.id));

  if (index === -1) {
    return next(new AppError("User not found", 404));
  }

  users.splice(index, 1);

  res.status(200).json({
    success: true,
    message: "User deleted"
  });
});

module.exports = router;