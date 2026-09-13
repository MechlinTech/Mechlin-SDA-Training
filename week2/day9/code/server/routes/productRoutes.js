const express = require("express");
const {
  validateProduct,
  validateId,
  validatePagination,
} = require("../middleware/validation");

const {
  authMiddleware,
  authorize,
  optionalAuth,
} = require("../middleware/auth");

const router = express.Router();


router.get("/", validatePagination, (req, res) => {
  res.json({
    success: true,
    message: "Get products endpoint",
    query: req.query,
  });
});


router.get("/:id", validateId, (req, res) => {
  res.json({
    success: true,
    message: "Get product endpoint",
    id: req.params.id,
  });
});


router.post(
  "/",
  authMiddleware,
  authorize("admin"),
  validateProduct,
  (req, res) => {
    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: req.body,
    });
  }
);


router.put(
  "/:id",
  authMiddleware,
  authorize("admin"),
  validateId,
  validateProduct,
  (req, res) => {
    res.json({
      success: true,
      message: "Product updated successfully",
      id: req.params.id,
      data: req.body,
    });
  }
);


router.delete(
  "/:id",
  authMiddleware,
  authorize("admin"),
  validateId,
  (req, res) => {
    res.json({
      success: true,
      message: "Product deleted successfully",
      id: req.params.id,
    });
  }
);


router.get("/public/featured", optionalAuth, (req, res) => {
  res.json({
    success: true,
    message: "Featured products",
    authenticated: !!req.user,
  });
});

module.exports = router;