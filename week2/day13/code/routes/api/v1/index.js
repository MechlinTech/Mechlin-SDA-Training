const express = require("express");

const userRoutes = require("../../userRoutes");
const productRoutes = require("../../productRoutes");
const orderRoutes = require("../../orderRoutes");
const analyticsRoutes = require("../../analyticsRoutes");

const router = express.Router();

router.use("/users", userRoutes);
router.use("/products", productRoutes);
router.use("/orders", orderRoutes);
router.use("/analytics", analyticsRoutes);

router.get("/", (req, res) => {
  res.json({
    success: true,
    version: "v1",
    message: "SDA Training API v1",
  });
});

module.exports = router;