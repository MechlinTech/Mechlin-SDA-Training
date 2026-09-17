const express = require("express");

const router = express.Router();

/**
 * @swagger
 * /api/v1/analytics:
 *   get:
 *     summary: Get API analytics
 *     description: Returns basic API analytics information
 *     tags:
 *       - Analytics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Analytics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalUsers:
 *                       type: integer
 *                       example: 100
 *                     totalProducts:
 *                       type: integer
 *                       example: 50
 *                     totalOrders:
 *                       type: integer
 *                       example: 200
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Insufficient permissions
 */
router.get("/", (req, res) => {
  res.json({
    success: true,
    data: {
      totalUsers: 100,
      totalProducts: 50,
      totalOrders: 200,
    },
  });
});

module.exports = router;