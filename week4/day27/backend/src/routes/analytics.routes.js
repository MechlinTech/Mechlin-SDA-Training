const express = require("express");

const router = express.Router();

const authenticateUser = require("../middleware/auth.middleware");

const {
  getAnalytics,
} = require("../controllers/analytics.controller");

router.get("/", authenticateUser, getAnalytics);

module.exports = router;