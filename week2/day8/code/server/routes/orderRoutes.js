const express = require("express");

const router = express.Router();

module.exports = (orderService) => {
  router.get("/", async (req, res, next) => {
    try {
      const orders = await orderService.getAllOrders();

      res.json({
        success: true,
        data: orders,
      });
    } catch (error) {
      next(error);
    }
  });

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

  router.get("/user/:userId", async (req, res, next) => {
    try {
      const orders = await orderService.getOrdersByUser(
        req.params.userId
      );

      res.json({
        success: true,
        data: orders,
      });
    } catch (error) {
      next(error);
    }
  });

  router.patch("/:id/status", async (req, res, next) => {
    try {
      const { status } = req.body;

      const order = await orderService.updateOrderStatus(
        req.params.id,
        status
      );

      res.json({
        success: true,
        data: order,
      });
    } catch (error) {
      next(error);
    }
  });

  return router;
};