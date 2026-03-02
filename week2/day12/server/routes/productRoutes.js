const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, async (req, res) => {
  const products = await Product.find();
  res.json({ success: true, data: { products } });
});

router.post('/', authenticate, async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json({ success: true, data: product });
});

router.get('/:id', authenticate, async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.json({ success: true, data: product });
});

module.exports = router;