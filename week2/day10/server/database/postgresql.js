const { Pool } = require("pg");

class PostgreSQLConnection {
  constructor() {
    this.pool = null;
    this.isConnected = false;
  }

  async connect() {
    this.pool = new Pool({
      user: "postgres",
      host: "localhost",
      database: "sda_training",
      password: "password",
      port: 5432,
    });

    const client = await this.pool.connect();
    await client.query("SELECT NOW()");
    client.release();

    this.isConnected = true;
    console.log("PostgreSQL connected successfully");
  }

  async query(text, params) {
    return await this.pool.query(text, params);
  }
}

module.exports = new PostgreSQLConnection();