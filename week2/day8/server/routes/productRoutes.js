const express = require("express");
const productService = require("../services/productService");

// Import Authentication Middleware
const {
  authenticate,
  authorize,
} = require("../middleware/auth");

// Import Validation Middleware
const {
  validateProduct,
  validateId,
  validatePagination,
} = require("../middleware/validation");

const router = express.Router();

/**
 * ============================================================================
 * Product Routes
 * ============================================================================
 *
 * Public Routes
 * -------------
 * GET    /          -> Get all products
 * GET    /:id       -> Get product by ID
 *
 * Protected Routes (Admin Only)
 * -----------------------------
 * POST   /          -> Create product
 * PUT    /:id       -> Update product
 * DELETE /:id       -> Delete product
 *
 * ============================================================================
 */

/**
 * ============================================================================
 * Create Product
 * ----------------------------------------------------------------------------
 * Protected Route (Admin)
 *
 * Middleware Flow:
 * authenticate -> authorize(admin) -> validateProduct -> Controller
 * ============================================================================
 */
router.post(
  "/",
  authenticate,
  authorize("admin"),
  validateProduct,
  async (req, res, next) => {
    try {
      const product = await productService.createProduct(req.body);

      res.status(201).json({
        success: true,
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * ============================================================================
 * Get All Products
 * ----------------------------------------------------------------------------
 * Public Route
 *
 * Middleware Flow:
 * validatePagination -> Controller
 * ============================================================================
 */
router.get("/", validatePagination, async (req, res, next) => {
  try {
    const products = await productService.getAllProducts();

    res.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * ============================================================================
 * Get Product By ID
 * ----------------------------------------------------------------------------
 * Public Route
 *
 * Middleware Flow:
 * validateId -> Controller
 * ============================================================================
 */
router.get("/:id", validateId, async (req, res, next) => {
  try {
    const product = await productService.getProductById(req.params.id);

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * ============================================================================
 * Update Product
 * ----------------------------------------------------------------------------
 * Protected Route (Admin)
 *
 * Middleware Flow:
 * authenticate -> authorize(admin) -> validateId
 * -> validateProduct -> Controller
 * ============================================================================
 */
router.put(
  "/:id",
  authenticate,
  authorize("admin"),
  validateId,
  validateProduct,
  async (req, res, next) => {
    try {
      const updatedProduct = await productService.updateProduct(
        req.params.id,
        req.body
      );

      res.json({
        success: true,
        data: updatedProduct,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * ============================================================================
 * Delete Product
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
      const response = await productService.deleteProduct(req.params.id);

      res.json({
        success: true,
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;