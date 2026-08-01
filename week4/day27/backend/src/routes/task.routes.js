const express = require("express");

const router = express.Router();

const authenticateUser = require("../middleware/auth.middleware");

const {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
} = require("../controllers/task.controller");

router.use(authenticateUser);

router.post("/", createTask);

router.get("/", getTasks);

router.get("/:id", getTask);

router.put("/:id", updateTask);

router.delete("/:id", deleteTask);

module.exports = router;