const express = require("express");
const orderService = require("../services/orderService");

// Import Authentication Middleware
const {
  authenticate,
  authorize,
} = require("../middleware/auth");

// Import Validation Middleware
const {
  validateOrder,
  validateId,
  validatePagination,
} = require("../middleware/validation");

const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management APIs
 */
/**
 * ============================================================================
 * Order Routes
 * ============================================================================
 *
 * Protected Routes
 * ----------------
 * POST   /          -> Create a new order
 * GET    /          -> Get all orders (Admin Only)
 * GET    /:id       -> Get order by ID
 * PUT    /:id       -> Update order status (Admin Only)
 * DELETE /:id       -> Delete order (Admin Only)
 *
 * ============================================================================
 */

/**
 * ============================================================================
 * Create Order
 * ----------------------------------------------------------------------------
 * Protected Route
 *
 * Middleware Flow:
 * authenticate -> validateOrder -> Controller
 * ============================================================================
 */
/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 example: 64a123456789abcdef123456
 *               quantity:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Order created successfully
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/",
  authenticate,
  validateOrder,
  async (req, res, next) => {
    try {
      const order = await orderService.createOrder(req.body);

      res.status(201).json({
        success: true,
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * ============================================================================
 * Get All Orders
 * ----------------------------------------------------------------------------
 * Protected Route (Admin)
 *
 * Middleware Flow:
 * authenticate -> authorize(admin) -> validatePagination -> Controller
 * ============================================================================
 */
/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of orders
 *       403:
 *         description: Admin access required
 */
router.get(
  "/",
  authenticate,
  authorize("admin"),
  validatePagination,
  async (req, res, next) => {
    try {
      const orders = await orderService.getAllOrders();

      res.json({
        success: true,
        count: orders.length,
        data: orders,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * ============================================================================
 * Get Order By ID
 * ----------------------------------------------------------------------------
 * Protected Route
 *
 * Middleware Flow:
 * authenticate -> validateId -> Controller
 * ============================================================================
 */
/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get order by ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order details
 *       404:
 *         description: Order not found
 */
router.get(
  "/:id",
  authenticate,
 validateId,
  async (req, res, next) => {
    try {
      const order = await orderService.getOrderById(req.params.id);

      res.json({
        success: true,
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * ============================================================================
 * Update Order Status
 * ----------------------------------------------------------------------------
 * Protected Route (Admin)
 *
 * Middleware Flow:
 * authenticate -> authorize(admin) -> validateId -> Controller
 * ============================================================================
 */
/**
 * @swagger
 * /api/orders/{id}:
 *   put:
 *     summary: Update order status
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: shipped
 *     responses:
 *       200:
 *         description: Order updated successfully
 *       403:
 *         description: Admin access required
 */
router.put(
  "/:id",
  authenticate,
  authorize("admin"),
  validateId,
  async (req, res, next) => {
    try {
      const order = await orderService.updateOrderStatus(
        req.params.id,
        req.body.status
      );

      res.json({
        success: true,
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * ============================================================================
 * Delete Order
 * ----------------------------------------------------------------------------
 * Protected Route (Admin)
 *
 * Middleware Flow:
 * authenticate -> authorize(admin) -> validateId -> Controller
 * ============================================================================
 */
/**
 * @swagger
 * /api/orders/{id}:
 *   delete:
 *     summary: Delete order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order deleted successfully
 *       404:
 *         description: Order not found
 */
router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  validateId,
  async (req, res, next) => {
    try {
      const result = await orderService.deleteOrder(req.params.id);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;