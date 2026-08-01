require("dotenv").config();

const http = require("http");

const app = require("./src/app");
const connectDB = require("./src/config/database");

connectDB();

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});