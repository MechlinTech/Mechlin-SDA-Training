const EventEmitter = require("events");

class NotificationService extends EventEmitter {
  constructor() {
    super();
  }

  initialize() {
    console.log("✅ Notification Service Initialized");

    this.registerEvents();
  }

  registerEvents() {
    this.on("user.created", (user) => {
      console.log(`📧 Welcome email sent to ${user.email}`);
    });

    this.on("order.created", (order) => {
      console.log(`📦 Order ${order.id} has been created.`);
    });

    this.on("product.updated", (product) => {
      console.log(`🛒 Product updated: ${product.name}`);
    });

    this.on("system.error", (error) => {
      console.error(`❌ System Error: ${error.message}`);
    });
  }

  notify(eventName, payload) {
    this.emit(eventName, payload);
  }
}

module.exports = new NotificationService();