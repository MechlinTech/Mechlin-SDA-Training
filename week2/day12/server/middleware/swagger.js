// middleware/swagger.js
const swaggerUi = require('swagger-ui-express');
const specs = require('../docs/openapi');

const swaggerOptions = {
  explorer: true,
  swaggerOptions: {
    urls: [
      {
        url: '/api/v1/docs/swagger.json',
        name: 'SDA Training API v1'
      }
    ]
  }
};

const setupSwagger = (app) => {
  // Serve Swagger JSON
  app.get('/api/v1/docs/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });

  // Serve Swagger UI
  app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(specs, swaggerOptions));

  // Redirect root docs to Swagger UI
  app.get('/api/v1/docs', (req, res) => {
    res.redirect('/api/v1/docs/');
  });
};

module.exports = { setupSwagger };