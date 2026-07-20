const { v4: uuidv4 } = require("uuid");
const notificationService = require("./notificationService");

class OrderService {
  constructor() {
    this.orders = new Map();
  }

  async initialize() {
    console.log("✅ Order Service Initialized");
  }

  async createOrder(orderData) {
    const {
      userId,
      productId,
      quantity = 1,
    } = orderData;

    if (!userId || !productId) {
      throw new Error("User ID and Product ID are required.");
    }

    const order = {
      id: uuidv4(),
      userId,
      productId,
      quantity,
      status: "Pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.orders.set(order.id, order);

    return order;
  }

  async getAllOrders() {
    return [...this.orders.values()];
  }

  async getOrderById(orderId) {
    const order = this.orders.get(orderId);

    if (!order) {
      throw new Error("Order not found.");
    }

    return order;
  }

  async updateOrderStatus(orderId, status) {
    const order = this.orders.get(orderId);

    if (!order) {
      throw new Error("Order not found.");
    }

    order.status = status;
    order.updatedAt = new Date();

    this.orders.set(order.id, order);

// Notify other services
    notificationService.notify("order.created", order);

    return order;
  }

  async deleteOrder(orderId) {
    if (!this.orders.has(orderId)) {
      throw new Error("Order not found.");
    }

    this.orders.delete(orderId);

    return {
      message: "Order deleted successfully.",
    };
  }
}

module.exports = new OrderService();