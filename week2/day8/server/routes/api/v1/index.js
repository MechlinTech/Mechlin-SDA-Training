const express = require("express");
const router = express.Router();

// Existing Routes
const userRoutes = require("../../userRoutes");
const productRoutes = require("../../productRoutes");
const orderRoutes = require("../../orderRoutes");

// Middleware
const { apiVersioning } = require("../../../middleware/apiVersioning");

// -----------------------------------------------------------------------------
// Temporary Analytics Route
// -----------------------------------------------------------------------------

const analyticsRoutes = express.Router();

analyticsRoutes.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Analytics API working",
    apiVersion: req.apiVersion,
  });
});

// -----------------------------------------------------------------------------
// Content Negotiation Middleware
// -----------------------------------------------------------------------------

const contentNegotiation = (req, res, next) => {
  const accept = req.headers.accept || "application/json";

  if (accept.includes("application/json")) {
    req.responseFormat = "json";
  } else if (accept.includes("application/xml")) {
    req.responseFormat = "xml";
  } else {
    req.responseFormat = "json";
  }

  next();
};

// -----------------------------------------------------------------------------
// Apply Middleware FIRST
// -----------------------------------------------------------------------------

router.use(apiVersioning);
router.use(contentNegotiation);

// -----------------------------------------------------------------------------
// API Root
// -----------------------------------------------------------------------------

router.get("/", (req, res) => {
  res.json({
    success: true,
    name: "SDA Training API",
    version: "1.0.0",
    apiVersion: req.apiVersion,
    responseFormat: req.responseFormat,
    description: "Advanced Backend API",
    endpoints: {
      users: "/api/v1/users",
      products: "/api/v1/products",
      orders: "/api/v1/orders",
      analytics: "/api/v1/analytics",
    },
    status: "Running",
  });
});

// -----------------------------------------------------------------------------
// Versioned Routes
// -----------------------------------------------------------------------------

router.use("/users", userRoutes);
router.use("/products", productRoutes);
router.use("/orders", orderRoutes);
router.use("/analytics", analyticsRoutes);

// -----------------------------------------------------------------------------
// Export
// -----------------------------------------------------------------------------

module.exports = router;