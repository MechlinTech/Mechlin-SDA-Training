const express = require("express");
const mongodb = require("./database/mongodb");
const postgresql = require("./database/postgresql");

const app = express();
const PORT = 5000;

async function startServer() {
  await mongodb.connect();
  await postgresql.connect();

  app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
  });
}

startServer();