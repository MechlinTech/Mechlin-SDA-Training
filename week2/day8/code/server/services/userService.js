const EventEmitter = require("events");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

class UserService extends EventEmitter {
  constructor() {
    super();

    this.users = new Map();
    this.sessions = new Map();

    this.jwtSecret = process.env.JWT_SECRET || "development-secret-key";
  }

  async initialize() {
    console.log("User service initialized");
  }

  async createUser(userData) {
    const { name, email, password } = userData;

    if (!name || !email || !password) {
      throw new Error("Name, email and password are required");
    }

    const existingUser = Array.from(this.users.values()).find(
      (user) => user.email === email
    );

    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
      id: uuidv4(),
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.users.set(user.id, user);

    this.emit("userCreated", {
      id: user.id,
      name: user.name,
      email: user.email,
    });

    return this.sanitizeUser(user);
  }

  async authenticateUser(email, password) {
    const user = Array.from(this.users.values()).find(
      (user) => user.email === email
    );

    if (!user) {
      throw new Error("Invalid email or password");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new Error("Invalid email or password");
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      this.jwtSecret,
      {
        expiresIn: "1h",
      }
    );

    const sessionId = uuidv4();

    this.sessions.set(sessionId, {
      userId: user.id,
      token,
      createdAt: new Date(),
    });

    this.emit("userAuthenticated", {
      userId: user.id,
    });

    return {
      user: this.sanitizeUser(user),
      token,
      sessionId,
    };
  }

  async getUserById(id) {
    const user = this.users.get(id);

    if (!user) {
      throw new Error("User not found");
    }

    return this.sanitizeUser(user);
  }

  async updateUser(id, updates) {
    const user = this.users.get(id);

    if (!user) {
      throw new Error("User not found");
    }

    if (updates.name) {
      user.name = updates.name;
    }

    if (updates.email) {
      user.email = updates.email;
    }

    if (updates.password) {
      user.password = await bcrypt.hash(updates.password, 10);
    }

    user.updatedAt = new Date();

    this.users.set(id, user);

    this.emit("userUpdated", {
      userId: id,
    });

    return this.sanitizeUser(user);
  }

  async deleteUser(id) {
    const user = this.users.get(id);

    if (!user) {
      throw new Error("User not found");
    }

    this.users.delete(id);

    for (const [sessionId, session] of this.sessions.entries()) {
      if (session.userId === id) {
        this.sessions.delete(sessionId);
      }
    }

    this.emit("userDeleted", {
      userId: id,
    });

    return {
      message: "User deleted successfully",
    };
  }

  async getAllUsers() {
    return Array.from(this.users.values()).map((user) =>
      this.sanitizeUser(user)
    );
  }

  validateToken(token) {
    try {
      return jwt.verify(token, this.jwtSecret);
    } catch (error) {
      throw new Error("Invalid or expired token");
    }
  }

  async logout(sessionId) {
    const session = this.sessions.get(sessionId);

    if (!session) {
      throw new Error("Session not found");
    }

    this.sessions.delete(sessionId);

    this.emit("userLoggedOut", {
      userId: session.userId,
    });

    return {
      message: "Logged out successfully",
    };
  }

  sanitizeUser(user) {
    const { password, ...safeUser } = user;
    return safeUser;
  }
}

module.exports = UserService;