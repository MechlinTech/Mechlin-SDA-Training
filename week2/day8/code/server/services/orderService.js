const EventEmitter = require("events");
const { v4: uuidv4 } = require("uuid");

class OrderService extends EventEmitter {
  constructor() {
    super();
    this.orders = new Map();
  }

  async initialize() {
    console.log("Order service initialized");
  }

  async createOrder(orderData) {
    const { userId, products, totalAmount } = orderData;

    if (!userId || !products || !products.length) {
      throw new Error("User ID and products are required");
    }

    const order = {
      id: uuidv4(),
      userId,
      products,
      totalAmount: totalAmount || 0,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.orders.set(order.id, order);

    this.emit("orderCreated", order);

    return order;
  }

  async getOrderById(id) {
    const order = this.orders.get(id);

    if (!order) {
      throw new Error("Order not found");
    }

    return order;
  }

  async getOrdersByUser(userId) {
    return Array.from(this.orders.values()).filter(
      (order) => order.userId === userId
    );
  }

  async updateOrderStatus(id, status) {
    const order = this.orders.get(id);

    if (!order) {
      throw new Error("Order not found");
    }

    order.status = status;
    order.updatedAt = new Date();

    this.orders.set(id, order);

    this.emit("orderStatusUpdated", order);

    return order;
  }

  async getAllOrders() {
    return Array.from(this.orders.values());
  }
}

module.exports = OrderService;