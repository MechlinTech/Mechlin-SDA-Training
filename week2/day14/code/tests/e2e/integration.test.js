const request = require("supertest");
const mongoose = require("mongoose");

const app = require("../../server/app");
const User = require("../../models/User");
const Product = require("../../models/Product");
const Order = require("../../models/Order");

const connectDatabase = require("../../server/database");

describe("End-to-End Integration Tests", () => {
  let authToken;
  let testUser;
  let testProduct;

  beforeAll(async () => {
    await connectDatabase();

    testUser = new User({
      name: "Integration Test User",
      email: "integration@test.com",
      password: "password123",
      role: "user"
    });

    await testUser.save();

    testProduct = new Product({
      name: "Test Product",
      description: "Test product description",
      price: 99.99,
      category: "Test",
      stock: 100
    });

    await testProduct.save();

    const loginResponse = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: "integration@test.com",
        password: "password123"
      });

    authToken = loginResponse.body.data.accessToken;
  });

  afterAll(async () => {
    await Order.deleteMany({ userId: testUser._id });
    await User.deleteMany({ email: "integration@test.com" });
    await User.deleteMany({ email: "newuser@test.com" });
    await Product.deleteMany({ name: "Test Product" });

    await mongoose.connection.close();
  });

  describe("Complete User Journey", () => {
    test("User can register, login, browse products, and place order", async () => {
      const registerResponse = await request(app)
        .post("/api/v1/auth/register")
        .send({
          name: "New User",
          email: "newuser@test.com",
          password: "password123"
        });

      expect(registerResponse.status).toBe(201);
      expect(registerResponse.body.success).toBe(true);

      const loginResponse = await request(app)
        .post("/api/v1/auth/login")
        .send({
          email: "newuser@test.com",
          password: "password123"
        });

      expect(loginResponse.status).toBe(200);

      const userToken = loginResponse.body.data.accessToken;

      const productsResponse = await request(app)
        .get("/api/v1/products")
        .set("Authorization", `Bearer ${userToken}`);

      expect(productsResponse.status).toBe(200);
      expect(productsResponse.body.data.products).toBeDefined();

      const productResponse = await request(app)
        .get(`/api/v1/products/${testProduct._id}`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(productResponse.status).toBe(200);
      expect(productResponse.body.data.name).toBe("Test Product");

      const orderData = {
        userId: testUser._id,
        items: [
          {
            productId: testProduct._id,
            quantity: 2,
            price: testProduct.price
          }
        ],
        shippingAddress: {
          street: "123 Test St",
          city: "Test City",
          state: "TS",
          zipCode: "12345",
          country: "USA"
        }
      };

      const orderResponse = await request(app)
        .post("/api/v1/orders")
        .set("Authorization", `Bearer ${userToken}`)
        .send(orderData);

      expect(orderResponse.status).toBe(201);
      expect(orderResponse.body.data.items).toHaveLength(1);

      const ordersResponse = await request(app)
        .get(`/api/v1/orders?userId=${testUser._id}`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(ordersResponse.status).toBe(200);
      expect(ordersResponse.body.data.orders).toHaveLength(1);

      const analyticsResponse = await request(app)
        .get("/api/v1/analytics")
        .set("Authorization", `Bearer ${userToken}`);

      expect(analyticsResponse.status).toBe(200);
      expect(analyticsResponse.body.data).toBeDefined();
    });
  });

  describe("Error Handling", () => {
    test("Should handle authentication errors", async () => {
     const response = await request(app)
  .get("/api/v1/users")
  .expect(401);

expect(response.body.success).toBe(false);
expect(response.body.error.message).toBe("Access token is required");

      expect(response.body.success).toBe(false);
    });

    test("Should handle invalid registration data", async () => {
      const response = await request(app)
        .post("/api/v1/auth/register")
        .send({
          name: "Test",
          email: "",
          password: ""
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    test("Should handle invalid product ID", async () => {
      const response = await request(app)
        .get("/api/v1/products/invalid-id")
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe("Performance Tests", () => {
    test("Should handle concurrent requests", async () => {
      const requests = Array(10)
        .fill()
        .map(() =>
          request(app)
            .get("/api/v1/products")
            .set("Authorization", `Bearer ${authToken}`)
        );

      const responses = await Promise.all(requests);

      responses.forEach((response) => {
        expect(response.status).toBe(200);
      });
    });

    test("Should respond within acceptable time", async () => {
      const start = Date.now();

      await request(app)
        .get("/api/v1/products")
        .set("Authorization", `Bearer ${authToken}`);

      const duration = Date.now() - start;

      expect(duration).toBeLessThan(1000);
    });
  });
});