// =============================================================================
// File: swagger.js
//
// Purpose:
// Configure Swagger/OpenAPI documentation for the application.
//
// Responsibilities:
// - Define API metadata
// - Configure API scanning
// - Export Swagger specification
//
// Importance:
// - Interactive API documentation
// - Easier frontend integration
// - Professional backend documentation
// =============================================================================

const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "Mechlin SDA Training API",
      version: "1.0.0",
      description:
        "REST API documentation for Week 2 Day 11 Training",
    },

    servers: [
      {
        url: "http://localhost:3000",
        description: "Development Server",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },

    security: [
      {
        bearerAuth: [],
      },
    ],
  },

  apis: [
    "./server/routes/*.js",
    "./server/routes/api/v1/*.js",
  ],
};

module.exports = swaggerJsdoc(options);