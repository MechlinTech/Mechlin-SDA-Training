const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class UserService {
  constructor() {
    this.users = new Map();
    this.secret = "supersecret";
  }

  async createUser({ email, password, name }) {
    if (!email || !password || !name) {
      throw new Error("All fields required");
    }

    if (this.users.has(email)) {
      throw new Error("User already exists");
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = {
      id: uuidv4(),
      email,
      password: hashed,
      name,
      createdAt: new Date()
    };

    this.users.set(email, user);

    return { id: user.id, email: user.email, name: user.name };
  }

  async login(email, password) {
    const user = this.users.get(email);
    if (!user) throw new Error("User not found");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error("Invalid password");

    const token = jwt.sign(
        { id: user.id, role: "user" },
        this.secret,
        { expiresIn: "1h" }
    );

    return { token };
  }

  getAllUsers() {
    return Array.from(this.users.values()).map(u => ({
      id: u.id,
      email: u.email,
      name: u.name
    }));
  }
}

module.exports = new UserService();