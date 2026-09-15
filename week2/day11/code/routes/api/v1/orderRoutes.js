/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all orders
 *     tags:
 *       - Orders
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 */

const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Orders API",
    version: req.apiVersion || "v1",
    data: [],
  });
});

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get an order by ID
 *     tags:
 *       - Orders
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order details retrieved successfully
 *       404:
 *         description: Order not found
 */

router.get("/:id", (req, res) => {
  res.json({
    success: true,
    message: "Order details",
    orderId: req.params.id,
    version: req.apiVersion || "v1",
  });
});

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order
 *     tags:
 *       - Orders
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Order created successfully
 */

router.post("/", (req, res) => {
  res.status(201).json({
    success: true,
    message: "Order created successfully",
    data: req.body,
  });
});

/**
 * @swagger
 * /orders/{id}:
 *   put:
 *     summary: Update an order
 *     tags:
 *       - Orders
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
 *     responses:
 *       200:
 *         description: Order updated successfully
 *       404:
 *         description: Order not found
 */

router.put("/:id", (req, res) => {
  res.json({
    success: true,
    message: "Order updated successfully",
    orderId: req.params.id,
    data: req.body,
  });
});

/**
 * @swagger
 * /orders/{id}:
 *   delete:
 *     summary: Delete an order
 *     tags:
 *       - Orders
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

router.delete("/:id", (req, res) => {
  res.json({
    success: true,
    message: "Order deleted successfully",
    orderId: req.params.id,
  });
});

module.exports = router;