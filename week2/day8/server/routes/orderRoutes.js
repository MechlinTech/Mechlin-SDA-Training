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