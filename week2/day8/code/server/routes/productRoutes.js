const express = require("express");

const router = express.Router();

module.exports = (productService) => {
  
  router.get("/", async (req, res, next) => {
    try {
      const products = await productService.getAllProducts();

      res.json({
        success: true,
        data: products,
      });
    } catch (error) {
      next(error);
    }
  });

 
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

  router.put("/:id", async (req, res, next) => {
    try {
      const product = await productService.updateProduct(
        req.params.id,
        req.body
      );

      res.json({
        success: true,
        data: product,
      });
    } catch (error) {
      next(error);
    }
  });

  
  router.delete("/:id", async (req, res, next) => {
    try {
      const result = await productService.deleteProduct(req.params.id);

      res.json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  });

  return router;
};