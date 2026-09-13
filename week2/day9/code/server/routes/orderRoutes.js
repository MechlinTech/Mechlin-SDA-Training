const express = require("express");
const {
  validateOrder,
  validateId,
  validatePagination,
} = require("../middleware/validation");

const {
  authMiddleware,
  authorize,
} = require("../middleware/auth");

const router = express.Router();


router.get(
  "/",
  authMiddleware,
  validatePagination,
  (req, res) => {
    res.json({
      success: true,
      message: "Get orders endpoint",
      user: req.user,
      query: req.query,
    });
  }
);


router.get(
  "/:id",
  authMiddleware,
  validateId,
  (req, res) => {
    res.json({
      success: true,
      message: "Get order endpoint",
      id: req.params.id,
      user: req.user,
    });
  }
);


router.post(
  "/",
  authMiddleware,
  validateOrder,
  (req, res) => {
    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: req.body,
      user: req.user,
    });
  }
);


router.patch(
  "/:id/status",
  authMiddleware,
  authorize("admin"),
  validateId,
  (req, res) => {
    res.json({
      success: true,
      message: "Order status updated successfully",
      id: req.params.id,
      status: req.body.status,
    });
  }
);


router.delete(
  "/:id",
  authMiddleware,
  validateId,
  (req, res) => {
    res.json({
      success: true,
      message: "Order cancelled successfully",
      id: req.params.id,
    });
  }
);

module.exports = router;