const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "SDA Training API",
      version: "1.0.0",
      description: "Day 11 REST API Best Practices"
    },
    servers: [
      {
        url: "http://localhost:5000"
      }
    ]
  },
  apis: []
};

const specs = swaggerJSDoc(options);

module.exports = { specs, swaggerUi };