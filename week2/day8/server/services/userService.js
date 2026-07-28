const EventEmitter = require("events");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const notificationService = require("./notificationService");

class UserService extends EventEmitter {
  constructor() {
    super();

    this.users = new Map();
    this.sessions = new Map();

    this.jwtSecret =
      process.env.JWT_SECRET || "week2-training-secret";

    this.jwtExpiresIn =
      process.env.JWT_EXPIRES_IN || "7d";
  }

  async initialize() {
    console.log("✅ User Service Initialized");
    this.registerEvents();
  }

  registerEvents() {
    this.on("user:created", (user) => {
      console.log(`User created: ${user.email}`);
    });

    this.on("user:updated", (user) => {
      console.log(`User updated: ${user.email}`);
    });

    this.on("user:deleted", (userId) => {
      console.log(`User deleted: ${userId}`);
    });
  }

  async createUser(userData) {
    const { name, email, password, role = "user" } = userData;

    if (!name || !email || !password) {
      throw new Error("All fields are required.");
    }

    if (this.users.has(email)) {
      throw new Error("User already exists.");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = {
      id: uuidv4(),
      name,
      email,
      password: hashedPassword,
      role,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.users.set(email, user);

    // Internal event
    this.emit("user:created", user);

    // Notify other services
    notificationService.notify("user.created", user);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }

  async authenticateUser(email, password) {
    const user = this.users.get(email);

    if (!user) {
      throw new Error("User not found.");
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      throw new Error("Invalid credentials.");
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      this.jwtSecret,
      {
        expiresIn: this.jwtExpiresIn,
      }
    );

    this.sessions.set(user.id, {
      token,
      loginTime: new Date(),
    });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async getUserById(userId) {
    const user = [...this.users.values()].find(
      (u) => u.id === userId
    );

    if (!user) {
      throw new Error("User not found.");
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };
  }

  async getAllUsers() {
    return [...this.users.values()].map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    }));
  }

  async updateUser(userId, updateData) {
    const user = [...this.users.values()].find(
      (u) => u.id === userId
    );

    if (!user) {
      throw new Error("User not found.");
    }

    Object.assign(user, updateData, {
      updatedAt: new Date(),
    });

    this.users.set(user.email, user);

    this.emit("user:updated", user);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }

  async deleteUser(userId) {
    const user = [...this.users.values()].find(
      (u) => u.id === userId
    );

    if (!user) {
      throw new Error("User not found.");
    }

    this.users.delete(user.email);
    this.sessions.delete(user.id);

    this.emit("user:deleted", user.id);

    return {
      message: "User deleted successfully.",
    };
  }

  async validateToken(token) {
    return jwt.verify(token, this.jwtSecret);
  }

  async logout(userId) {
    this.sessions.delete(userId);

    return {
      message: "Logout successful.",
    };
  }
}

module.exports = new UserService();