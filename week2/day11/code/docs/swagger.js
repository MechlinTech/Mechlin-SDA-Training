const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "SDA Training API",
      version: "1.0.0",
      description: "Advanced backend API for SDA training program",
      contact: {
        name: "API Support",
        email: "support@sda-training.com",
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },

    servers: [
      {
        url: "http://localhost:3000/api/v1",
        description: "Development server",
      },
      {
        url: "https://api.sda-training.com/v1",
        description: "Production server",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },

        apiKey: {
          type: "apiKey",
          in: "header",
          name: "X-API-Key",
        },
      },

      schemas: {
        User: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            id: {
              type: "string",
              format: "uuid",
            },
            name: {
              type: "string",
              minLength: 2,
              maxLength: 50,
            },
            email: {
              type: "string",
              format: "email",
            },
            role: {
              type: "string",
              enum: ["user", "admin", "moderator"],
            },
            isActive: {
              type: "boolean",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },

        Product: {
          type: "object",
          required: ["name", "description", "price", "category"],
          properties: {
            id: {
              type: "string",
              format: "uuid",
            },
            name: {
              type: "string",
              minLength: 2,
              maxLength: 100,
            },
            description: {
              type: "string",
              minLength: 10,
              maxLength: 500,
            },
            price: {
              type: "number",
              minimum: 0,
            },
            category: {
              type: "string",
            },
            stock: {
              type: "integer",
              minimum: 0,
            },
            imageUrl: {
              type: "string",
              format: "uri",
            },
            tags: {
              type: "array",
              items: {
                type: "string",
              },
            },
          },
        },

        Error: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            error: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                },
                code: {
                  type: "string",
                },
                details: {
                  type: "array",
                  items: {
                    type: "object",
                  },
                },
              },
            },
          },
        },
      },
    },

    security: [
      {
        bearerAuth: [],
      },
      {
        apiKey: [],
      },
    ],
  },

  apis: ["./routes/**/*.js"],
};

const specs = swaggerJSDoc(options);

module.exports = {
  specs,
  swaggerUi,
};