const express = require("express");
const orderService = require("../services/orderService");

const router = express.Router();

// Create Order
router.post("/", async (req, res, next) => {
  try {
    const order = await orderService.createOrder(req.body);

    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
});

// Get All Orders
router.get("/", async (req, res, next) => {
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
});

// Get Order By ID
router.get("/:id", async (req, res, next) => {
  try {
    const order = await orderService.getOrderById(req.params.id);

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
});

// Update Order Status
router.put("/:id", async (req, res, next) => {
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
});

// Delete Order
router.delete("/:id", async (req, res, next) => {
  try {
    const result = await orderService.deleteOrder(req.params.id);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;