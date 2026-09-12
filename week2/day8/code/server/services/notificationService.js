const EventEmitter = require("events");
const { v4: uuidv4 } = require("uuid");

class NotificationService extends EventEmitter {
  constructor() {
    super();
    this.notifications = new Map();
  }

  async initialize() {
    console.log("Notification service initialized");
  }

  async createNotification(notificationData) {
    const { userId, type, message } = notificationData;

    if (!userId || !message) {
      throw new Error("User ID and message are required");
    }

    const notification = {
      id: uuidv4(),
      userId,
      type: type || "info",
      message,
      read: false,
      createdAt: new Date(),
    };

    this.notifications.set(notification.id, notification);

    this.emit("notificationCreated", notification);

    return notification;
  }

  async getNotificationsByUser(userId) {
    return Array.from(this.notifications.values()).filter(
      (notification) => notification.userId === userId
    );
  }

  async markAsRead(id) {
    const notification = this.notifications.get(id);

    if (!notification) {
      throw new Error("Notification not found");
    }

    notification.read = true;

    this.notifications.set(id, notification);

    this.emit("notificationRead", notification);

    return notification;
  }

  async deleteNotification(id) {
    const notification = this.notifications.get(id);

    if (!notification) {
      throw new Error("Notification not found");
    }

    this.notifications.delete(id);

    this.emit("notificationDeleted", {
      notificationId: id,
    });

    return {
      message: "Notification deleted successfully",
    };
  }
}

module.exports = NotificationService;