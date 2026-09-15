
const express = require("express");

const router = express.Router();

/**
 * @swagger
 * /analytics:
 *   get:
 *     summary: Get analytics data
 *     tags:
 *       - Analytics
 *     responses:
 *       200:
 *         description: Analytics data retrieved successfully
 */

router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Analytics API",
    version: req.apiVersion || "v1",
    data: {
      users: 0,
      products: 0,
      orders: 0,
    },
  });
});

/**
 * @swagger
 * /analytics/summary:
 *   get:
 *     summary: Get analytics summary
 *     tags:
 *       - Analytics
 *     responses:
 *       200:
 *         description: Analytics summary retrieved successfully
 */

router.get("/summary", (req, res) => {
  res.json({
    success: true,
    message: "Analytics summary",
    data: {
      totalUsers: 0,
      totalProducts: 0,
      totalOrders: 0,
    },
  });
});

module.exports = router;