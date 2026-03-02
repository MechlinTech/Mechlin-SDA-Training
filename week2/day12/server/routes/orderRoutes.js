const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, async (req, res) => {
  const orders = await Order.find({ userId: req.user._id });
  res.json({ success: true, data: { orders } });
});

router.post('/', authenticate, async (req, res) => {
  const { items, shippingAddress } = req.body;

  let total = 0;
  items.forEach(item => {
    total += item.price * item.quantity;
  });

  const order = await Order.create({
    userId: req.user._id,
    items,
    total,
    shippingAddress
  });

  res.status(201).json({ success: true, data: order });
});

module.exports = router;