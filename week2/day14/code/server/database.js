const mongoose = require("mongoose");

const connectDatabase = async () => {
  const mongoUri =
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/sda-training-day14";

  await mongoose.connect(mongoUri);

  console.log("MongoDB connected");
};

module.exports = connectDatabase;
