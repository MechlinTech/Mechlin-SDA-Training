require("dotenv").config();

const mongodb = require("./database/mongodb");
const postgresql = require("./database/postgresql");

async function testDatabases() {
  console.log("Testing MongoDB...");

  try {
    await mongodb.connect();
    console.log("MongoDB Status:", mongodb.getConnectionStatus());
    await mongodb.disconnect();
    console.log("MongoDB test passed.");
  } catch (error) {
    console.log("MongoDB test failed:", error.message);
  }

  console.log("\nTesting PostgreSQL...");

  try {
    await postgresql.connect();
    const result = await postgresql.query("SELECT NOW()");
    console.log("PostgreSQL Time:", result.rows[0]);
    console.log("PostgreSQL Status:", postgresql.getConnectionStatus());
    await postgresql.disconnect();
    console.log("PostgreSQL test passed.");
  } catch (error) {
    console.log("PostgreSQL test failed:", error.message);
  }
}

testDatabases();