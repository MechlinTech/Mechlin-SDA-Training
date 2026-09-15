require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");

const { apiVersioning } = require("./middleware/apiVersioning");
const { generalLimiter } = require("./middleware/rateLimiting");
const { errorHandler } = require("./middleware/errorHandler");
const { specs, swaggerUi } = require("./docs/swagger");

const apiRoutes = require("./routes/api/v1");

const app = express();

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use(generalLimiter);
app.use(apiVersioning);

app.get("/health", (req, res) => {
  res.json({
    success: true,
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/v1", apiRoutes);
app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`SDA Training API running on port ${PORT}`);
});

module.exports = app;