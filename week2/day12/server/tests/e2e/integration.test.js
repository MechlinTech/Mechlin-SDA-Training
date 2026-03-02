// tests/e2e/integration.test.js
const request = require('supertest');
const app = require('../../app');
const User = require('../../models/User');
const Product = require('../../models/Product');
const Order = require('../../models/Order');
const { authService } = require('../../middleware/auth');
const mongoose = require('mongoose');

describe('End-to-End Integration Tests', () => {
  let authToken;
  let testUser;
  let testProduct;

  beforeAll(async () => {
  await mongoose.connection.dropDatabase();
  const hashedPassword = await authService.hashPassword('Password@123');


  testUser = new User({
    name: 'Integration Test User',
    email: 'integration@test.com',
    password: hashedPassword,
    role: 'user'
  });

  await testUser.save();

    // Create test product
    testProduct = new Product({
      name: 'Test Product',
      description: 'Test product description',
      price: 99.99,
      category: 'Test',
      stock: 100
    });
    await testProduct.save();

    // Login to get auth token
    const loginResponse = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'integration@test.com',
        password: 'Password@123'
      });

    authToken = loginResponse.body.data.accessToken;
  });

  afterAll(async () => {
    // Clean up test data
    await User.deleteMany({ email: 'integration@test.com' });
    await Product.deleteMany({ name: 'Test Product' });
    await Order.deleteMany({ userId: testUser._id });
  });

  describe('Complete User Journey', () => {
    test('User can register, login, browse products, and place order', async () => {
      // 1. Register new user
      const registerResponse = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'New User',
          email: 'newuser@test.com',
          password: 'Password@123'
        });

      expect(registerResponse.status).toBe(201);
      expect(registerResponse.body.success).toBe(true);

      // 2. Login user
      const loginResponse = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'newuser@test.com',
          password: 'Password@123'
        });

      expect(loginResponse.status).toBe(200);
      const userToken = loginResponse.body.data.accessToken;

      // 3. Browse products
      const productsResponse = await request(app)
        .get('/api/v1/products')
        .set('Authorization', `Bearer ${userToken}`);

      expect(productsResponse.status).toBe(200);
      expect(productsResponse.body.data.products).toBeDefined();

      // 4. Get specific product
      const productResponse = await request(app)
        .get(`/api/v1/products/${testProduct._id}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(productResponse.status).toBe(200);
      expect(productResponse.body.data.name).toBe('Test Product');

      // 5. Create order
      const orderData = {
        items: [
          {
            productId: testProduct._id,
            quantity: 2,
            price: testProduct.price
          }
        ],
        shippingAddress: {
          street: '123 Test St',
          city: 'Test City',
          state: 'TS',
          zipCode: '12345',
          country: 'USA'
        }
      };

      const orderResponse = await request(app)
        .post('/api/v1/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send(orderData);

      expect(orderResponse.status).toBe(201);
      expect(orderResponse.body.data.items).toHaveLength(1);

      // 6. Get user orders
      const ordersResponse = await request(app)
        .get('/api/v1/orders')
        .set('Authorization', `Bearer ${userToken}`);

      expect(ordersResponse.status).toBe(200);
      expect(ordersResponse.body.data.orders).toHaveLength(1);

      // 7. Get analytics
      const analyticsResponse = await request(app)
        .get('/api/v1/analytics')
        .set('Authorization', `Bearer ${userToken}`);

      expect(analyticsResponse.status).toBe(200);
      expect(analyticsResponse.body.data).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    test('Should handle authentication errors', async () => {
      const response = await request(app)
        .get('/api/v1/users')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toBe('Access token is required');
    });

    test('Should handle authorization errors', async () => {
      const response = await request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toBe('Insufficient permissions');
    });

    test('Should handle validation errors', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Test',
          email: 'invalid-email',
          password: '123'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.details).toBeDefined();
    });
  });

  describe('Performance Tests', () => {
    test('Should handle concurrent requests', async () => {
      const requests = Array(10).fill().map(() =>
        request(app)
          .get('/api/v1/products')
          .set('Authorization', `Bearer ${authToken}`)
      );

      const responses = await Promise.all(requests);
      
      responses.forEach(response => {
        expect(response.status).toBe(200);
      });
    });

    test('Should respond within acceptable time', async () => {
      const start = Date.now();
      
      await request(app)
        .get('/api/v1/products')
        .set('Authorization', `Bearer ${authToken}`);

      const duration = Date.now() - start;
      expect(duration).toBeLessThan(1000); // Should respond within 1 second
    });
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
