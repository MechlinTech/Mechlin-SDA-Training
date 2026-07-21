const express = require("express");
const userService = require("../services/userService");

// Import Authentication Middleware
const {
  authenticate,
  authorize,
} = require("../middleware/auth");

// Import Validation Middleware
const {
  validateUser,
  validateLogin,
  validateId,
} = require("../middleware/validation");

const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management APIs
 */

/**
 * ============================================================================
 * User Routes
 * ============================================================================
 *
 * Public Routes
 * -------------
 * POST   /          -> Register a new user
 * POST   /login     -> Login user
 *
 * Protected Routes
 * ----------------
 * GET    /          -> Get all users (Admin Only)
 * GET    /:id       -> Get user by ID
 * PUT    /:id       -> Update user
 * DELETE /:id       -> Delete user (Admin Only)
 *
 * ============================================================================
 */

/**
 * ============================================================================
 * Register New User
 * ----------------------------------------------------------------------------
 * Public Route
 *
 * Validation Flow:
 * validateUser -> Controller
 * ============================================================================
 */
/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: Password@123
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Validation error
 */
router.post("/", validateUser, async (req, res) => {
  try {
    const user = await userService.createUser(req.body);

    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * ============================================================================
 * Login User
 * ----------------------------------------------------------------------------
 * Public Route
 *
 * Validation Flow:
 * validateLogin -> Controller
 * ============================================================================
 */
/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: Password@123
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await userService.authenticateUser(email, password);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * ============================================================================
 * Get All Users
 * ----------------------------------------------------------------------------
 * Protected Route
 *
 * Middleware Flow:
 * authenticate -> authorize(admin) -> Controller
 * ============================================================================
 */
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get("/", authenticate, authorize("admin"), async (req, res) => {
  try {
    const users = await userService.getAllUsers();

    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * ============================================================================
 * Get User By ID
 * ----------------------------------------------------------------------------
 * Protected Route
 *
 * Middleware Flow:
 * authenticate -> validateId -> Controller
 * ============================================================================
 */
/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
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
 *         description: User details
 *       404:
 *         description: User not found
 */
router.get("/:id", authenticate, validateId, async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * ============================================================================
 * Update User
 * ----------------------------------------------------------------------------
 * Protected Route
 *
 * Middleware Flow:
 * authenticate -> validateId -> validateUser -> Controller
 * ============================================================================
 */
/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update user
 *     tags: [Users]
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
 *         description: User updated successfully
 *       400:
 *         description: Validation error
 */
router.put(
  "/:id",
  authenticate,
  validateId,
  validateUser,
  async (req, res) => {
    try {
      const user = await userService.updateUser(req.params.id, req.body);

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
);

/**
 * ============================================================================
 * Delete User
 * ----------------------------------------------------------------------------
 * Protected Route
 *
 * Middleware Flow:
 * authenticate -> authorize(admin) -> validateId -> Controller
 * ============================================================================
 */
/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete user
 *     tags: [Users]
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
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  validateId,
  async (req, res) => {
    try {
      const result = await userService.deleteUser(req.params.id);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }
);

module.exports = router;