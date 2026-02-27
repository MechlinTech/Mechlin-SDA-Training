const express = require("express");
const router = express.Router();

const userRoutes = require("./userRoutes");

router.get("/", (req, res) => {
  res.json({
    message: "API v1 running",
    version: "v1"
  });
});

router.use("/users", userRoutes);

module.exports = router;