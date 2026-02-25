const mongoose = require("mongoose");

class MongoDBConnection {
  constructor() {
    this.isConnected = false;
  }

  async connect() {
    const mongoUri =
      process.env.MONGODB_URI ||
      "mongodb://localhost:27017/sda-training";

    await mongoose.connect(mongoUri);

    this.isConnected = true;
    console.log("MongoDB connected successfully");
  }
}

module.exports = new MongoDBConnection();