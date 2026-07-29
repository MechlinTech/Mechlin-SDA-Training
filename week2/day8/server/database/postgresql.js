const { Pool } = require("pg");
const { logger } = require("../middleware/errorHandler");

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

const connectPostgreSQL = async () => {
  try {
    const client = await pool.connect();

    logger.info("✅ PostgreSQL Connected");
    console.log("✅ PostgreSQL Connected");

    client.release();
  } catch (error) {
    logger.error(`PostgreSQL Connection Error: ${error.message}`);
    console.error("❌ PostgreSQL Connection Failed");
  }
};

module.exports = {
  pool,
  connectPostgreSQL,
};