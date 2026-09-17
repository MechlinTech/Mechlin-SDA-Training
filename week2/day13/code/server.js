const express = require("express");
const swaggerUi = require("swagger-ui-express");

const swaggerSpec = require("./docs/openapi");
const apiV1Router = require("./routes/api/v1");

const app = express();

app.use(express.json());

app.use("/api/v1", apiV1Router);

// Swagger JSON
app.get("/api/v1/docs/swagger.json", (req, res) => {
  res.json(swaggerSpec);
});

// Swagger UI
app.use(
  "/api/v1/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

// Redirect root docs
app.get("/docs", (req, res) => {
  res.redirect("/api/v1/docs");
});

app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Day 13 API Documentation server is running",
  });
});

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Day 13 API Documentation server running on port ${PORT}`);
    console.log(`Swagger UI: http://localhost:${PORT}/api/v1/docs`);
  });
}

module.exports = app;