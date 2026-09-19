const express = require("express");
require("dotenv").config();

const connectDatabase = require("./database");
const {
  monitoringMiddleware,
  healthCheck,
  metrics
} = require("../middleware/monitoring");

const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");

const app = express();

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      error: {
        message: "Access token is required"
      }
    });
  }

  next();
};

app.use(express.json());
app.use(monitoringMiddleware);

app.get("/health", healthCheck);

app.get("/metrics", metrics);
app.post("/api/v1/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: {
          message: "Name, email and password are required"
        }
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: {
          message: "User already exists"
        }
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: "user"
    });

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: error.message
      }
    });
  }
});

app.post("/api/v1/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, password });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          message: "Invalid credentials"
        }
      });
    }

    res.status(200).json({
      success: true,
      data: {
        accessToken: "day14-demo-token"
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: error.message
      }
    });
  }
});

app.get("/api/v1/users", authenticate, async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json({
      success: true,
      data: {
        users
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: error.message
      }
    });
  }
});

app.get("/api/v1/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: {
          message: "Product not found"
        }
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: {
        message: "Invalid product ID"
      }
    });
  }
});

app.get("/api/v1/products", async (req, res) => {
  const products = await Product.find();

  res.status(200).json({
    success: true,
    data: {
      products
    }
  });
});

app.post("/api/v1/orders", async (req, res) => {
  try {
    const { userId, items, shippingAddress } = req.body;

    if (!userId || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          message: "userId and items are required"
        }
      });
    }

    const order = await Order.create({
      userId,
      items,
      shippingAddress
    });

    res.status(201).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: error.message
      }
    });
  }
});

app.get("/api/v1/orders", async (req, res) => {
  try {
    const { userId } = req.query;

    const orders = await Order.find(
      userId ? { userId } : {}
    );

    res.status(200).json({
      success: true,
      data: {
        orders
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: error.message
      }
    });
  }
});

app.get("/api/v1/analytics", (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      totalOrders: 0,
      totalProducts: 0
    }
  });
});

module.exports = app;