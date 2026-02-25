const postgresql = require("./database/postgresql");
const migration = require("./migrations/001_create_users_table");

async function run() {
  await postgresql.connect();
  await migration.up();
  process.exit();
}

run();