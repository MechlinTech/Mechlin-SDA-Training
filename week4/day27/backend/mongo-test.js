require("dotenv").config();

const { MongoClient } = require("mongodb");

async function run() {
  try {
    console.log("Connecting...");
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    console.log("✅ Connected Successfully");
    await client.close();
  } catch (err) {
    console.error(err);
  }
}

run();