const EventEmitter = require("events");
const { v4: uuidv4 } = require("uuid");

class ProductService extends EventEmitter {
  constructor() {
    super();
    this.products = new Map();
  }

  async initialize() {
    console.log("Product service initialized");
  }

  async createProduct(productData) {
    const { name, price, description, category } = productData;

    if (!name || price === undefined) {
      throw new Error("Product name and price are required");
    }

    const product = {
      id: uuidv4(),
      name,
      price,
      description: description || "",
      category: category || "General",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.products.set(product.id, product);

    this.emit("productCreated", product);

    return product;
  }

  async getProductById(id) {
    const product = this.products.get(id);

    if (!product) {
      throw new Error("Product not found");
    }

    return product;
  }

  async getAllProducts() {
    return Array.from(this.products.values());
  }

  async updateProduct(id, updates) {
    const product = this.products.get(id);

    if (!product) {
      throw new Error("Product not found");
    }

    Object.assign(product, updates);
    product.updatedAt = new Date();

    this.products.set(id, product);

    this.emit("productUpdated", product);

    return product;
  }

  async deleteProduct(id) {
    const product = this.products.get(id);

    if (!product) {
      throw new Error("Product not found");
    }

    this.products.delete(id);

    this.emit("productDeleted", {
      productId: id,
    });

    return {
      message: "Product deleted successfully",
    };
  }
}

module.exports = ProductService;