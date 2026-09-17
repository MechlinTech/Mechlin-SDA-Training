const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "SDA Training API",
      version: "1.0.0",
      description:
        "API documentation for the SDA Training project",
      contact: {
        name: "SDA Training Team",
      },
      license: {
        name: "MIT",
      },
    },

    servers: [
      {
        url: "http://localhost:3000",
        description: "Local development server",
      },
      {
        url: "https://api.example.com",
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
          properties: {
            id: {
              type: "string",
              example: "64f123abc456",
            },
            name: {
              type: "string",
              example: "John Doe",
            },
            email: {
              type: "string",
              format: "email",
              example: "john@example.com",
            },
            role: {
              type: "string",
              enum: ["user", "moderator", "admin"],
              example: "user",
            },
          },
        },

        Product: {
          type: "object",
          properties: {
            id: {
              type: "string",
              example: "prod123",
            },
            name: {
              type: "string",
              example: "Laptop",
            },
            description: {
              type: "string",
              example: "Business laptop",
            },
            price: {
              type: "number",
              example: 75000,
            },
          },
        },

        Order: {
          type: "object",
          properties: {
            id: {
              type: "string",
              example: "order123",
            },
            userId: {
              type: "string",
              example: "user123",
            },
            status: {
              type: "string",
              example: "pending",
            },
            total: {
              type: "number",
              example: 75000,
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
            message: {
              type: "string",
              example: "Something went wrong",
            },
            statusCode: {
              type: "integer",
              example: 400,
            },
          },
        },

        Pagination: {
          type: "object",
          properties: {
            page: {
              type: "integer",
              example: 1,
            },
            limit: {
              type: "integer",
              example: 10,
            },
            total: {
              type: "integer",
              example: 100,
            },
            pages: {
              type: "integer",
              example: 10,
            },
          },
        },
      },
    },
  },

  apis: [
    "./routes/**/*.js",
    "./models/**/*.js",
  ],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;