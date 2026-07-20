const mongoose = require("mongoose");
const { logger } = require("../middleware/errorHandler");

const connectMongoDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10,
    });

    logger.info(`MongoDB Connected: ${connection.connection.host}`);
    console.log(`✅ MongoDB Connected: ${connection.connection.host}`);
  } catch (error) {
    logger.error(`MongoDB Connection Error: ${error.message}`);
    console.error("❌ MongoDB Connection Failed");

    process.exit(1);
  }
};

module.exports = connectMongoDB;