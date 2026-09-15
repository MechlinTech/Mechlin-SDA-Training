require("dotenv").config();

const { cacheService } = require("./middleware/caching");

async function testCache() {
  try {
    console.log("Connecting to Redis...");

    await cacheService.connect();

    console.log("Redis connected.");

    const key = "test:user";
    const value = {
      name: "Rayyan",
      purpose: "Day 11 Redis Cache Test",
    };

    await cacheService.set(key, value, 60);

    console.log("Data stored in Redis.");

    const cachedValue = await cacheService.get(key);

    console.log("Data retrieved from Redis:");
    console.log(cachedValue);

    await cacheService.del(key);

    console.log("Test data deleted.");

    process.exit(0);
  } catch (error) {
    console.error("Redis test failed:", error.message);
    process.exit(1);
  }
}

testCache();