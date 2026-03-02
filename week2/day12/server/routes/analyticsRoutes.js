const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, async (req, res) => {
  const orders = await Order.find();
  const products = await Product.find();

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

  res.json({
    success: true,
    data: {
      totalOrders: orders.length,
      totalProducts: products.length,
      totalRevenue
    }
  });
});

module.exports = router;