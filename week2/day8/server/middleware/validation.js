const { body, param, query, validationResult } = require("express-validator");
const { AppError } = require("./errorHandler");

/**
 * ============================================================================
 * Validation Middleware
 * ============================================================================
 *
 * This file contains reusable validation middleware for validating incoming
 * API requests before they reach controllers.
 *
 * Available Validators:
 *
 * 1. validateRequest()
 *    Converts express-validator errors into a standard API response.
 *
 * 2. validateUser
 *    Used while creating/updating users.
 *
 * 3. validateLogin
 *    Used during login.
 *
 * 4. validateProduct
 *    Used while creating/updating products.
 *
 * 5. validateOrder
 *    Used while placing orders.
 *
 * 6. validateId
 *    Validates route parameters like /users/:id
 *
 * 7. validatePagination
 *    Validates page, limit, sort and order query parameters.
 *
 * ============================================================================
 */

/**
 * ============================================================================
 * validateRequest
 * ----------------------------------------------------------------------------
 * Checks whether any validation errors occurred.
 *
 * If validation fails:
 *      Returns HTTP 400 with all validation errors.
 *
 * Otherwise:
 *      Continues to the next middleware/controller.
 * ============================================================================
 */
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(
      new AppError("Validation failed", 400, {
        errors: errors.array(),
      })
    );
  }

  next();
};

/**
 * ============================================================================
 * User Validation
 * ============================================================================
 */
const validateUser = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name should be between 2 and 50 characters"),

  body("email")
    .trim()
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password should be at least 6 characters"),

  body("role")
    .optional()
    .isIn(["user", "admin"])
    .withMessage("Role must be either user or admin"),

  validateRequest,
];

/**
 * ============================================================================
 * Login Validation
 * ============================================================================
 */
const validateLogin = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Valid email is required"),

  body("password")
    .notEmpty()
    .withMessage("Password is required"),

  validateRequest,
];

/**
 * ============================================================================
 * Product Validation
 * ============================================================================
 */
const validateProduct = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Product name is required"),

  body("price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),

  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock cannot be negative"),

  validateRequest,
];

/**
 * ============================================================================
 * Order Validation
 * ============================================================================
 */
const validateOrder = [
  body("items")
    .isArray({ min: 1 })
    .withMessage("Order must contain at least one item"),

  body("shippingAddress")
    .notEmpty()
    .withMessage("Shipping address is required"),

  validateRequest,
];

/**
 * ============================================================================
 * Route Parameter Validation
 * ============================================================================
 */
const validateId = [
  param("id")
    .notEmpty()
    .withMessage("ID parameter is required"),

  validateRequest,
];

/**
 * ============================================================================
 * Pagination Validation
 * ============================================================================
 */
const validatePagination = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be greater than 0"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),

  query("sort")
    .optional()
    .isString(),

  query("order")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("Order must be asc or desc"),

  validateRequest,
];

module.exports = {
  validateRequest,
  validateUser,
  validateLogin,
  validateProduct,
  validateOrder,
  validateId,
  validatePagination,
};