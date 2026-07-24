const { v4: uuidv4 } = require("uuid");

class ProductService {
  constructor() {
    this.products = new Map();
  }

  async initialize() {
    console.log("✅ Product Service Initialized");
  }

  async createProduct(productData) {
    const {
      name,
      description,
      price,
      category,
      stock = 0,
    } = productData;

    if (!name || !price) {
      throw new Error("Product name and price are required.");
    }

    const product = {
      id: uuidv4(),
      name,
      description: description || "",
      price,
      category: category || "General",
      stock,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.products.set(product.id, product);

    return product;
  }

  async getAllProducts() {
    return [...this.products.values()];
  }

  async getProductById(productId) {
    const product = this.products.get(productId);

    if (!product) {
      throw new Error("Product not found.");
    }

    return product;
  }

  async updateProduct(productId, updateData) {
    const product = this.products.get(productId);

    if (!product) {
      throw new Error("Product not found.");
    }

    Object.assign(product, updateData, {
      updatedAt: new Date(),
    });

    this.products.set(productId, product);

// Notify other services
    notificationService.notify("product.updated", product);

    return product;
  }

  async deleteProduct(productId) {
    const product = this.products.get(productId);

    if (!product) {
      throw new Error("Product not found.");
    }

    this.products.delete(productId);

    return {
      message: "Product deleted successfully.",
    };
  }
}

module.exports = new ProductService();