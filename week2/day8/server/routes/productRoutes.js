const express = require("express");
const productService = require("../services/productService");

const router = express.Router();

// Create Product
router.post("/", async (req, res, next) => {
  try {
    const product = await productService.createProduct(req.body);

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
});

// Get All Products
router.get("/", async (req, res, next) => {
  try {
    const products = await productService.getAllProducts();

    res.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    next(error);
  }
});

// Get Product By ID
router.get("/:id", async (req, res, next) => {
  try {
    const product = await productService.getProductById(req.params.id);

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
});

// Update Product
router.put("/:id", async (req, res, next) => {
  try {
    const updatedProduct = await productService.updateProduct(
      req.params.id,
      req.body
    );

    res.json({
      success: true,
      data: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
});

// Delete Product
router.delete("/:id", async (req, res, next) => {
  try {
    const response = await productService.deleteProduct(req.params.id);

    res.json({
      success: true,
      data: response,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;