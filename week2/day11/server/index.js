const express = require("express");
const { specs, swaggerUi } = require("./docs/swagger");
const apiV1Routes = require("./routes/api/v1");
const rateLimiter = require("./middleware/rateLimiter");
const { errorHandler } = require("./middleware/errorHandler");
const compression = require("compression");

const app = express();
const PORT = 5000;

app.use(express.json());

app.use(rateLimiter);   // 👈 here

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use("/api/v1", apiV1Routes);

app.use(errorHandler); // 👈 LAST
app.use(compression());

app.get("/", (req, res) => {
  res.json({ message: "Server running" });
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});