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
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management APIs
 */
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
/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: iPhone 16
 *               price:
 *                 type: number
 *                 example: 79999
 *               category:
 *                 type: string
 *                 example: Electronics
 *     responses:
 *       201:
 *         description: Product created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
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
/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of products
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
/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product details
 *       404:
 *         description: Product not found
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
/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update product
 *     tags: [Products]
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
 *         description: Product updated successfully
 *       400:
 *         description: Validation error
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
/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete product
 *     tags: [Products]
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
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
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