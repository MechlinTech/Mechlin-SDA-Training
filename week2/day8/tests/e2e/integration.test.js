const request = require("supertest");
const app = require("../../server/app");
const mongoose = require("mongoose");
const connectMongoDB = require("../../server/database/mongodb");


beforeAll(async () => {
    await connectMongoDB();
  }, 10000);
  
  afterAll(async () => {
    await mongoose.connection.close();
  });

describe("Week 2 Day 14 - Integration Tests", () => {

  describe("Health Check", () => {
    test("GET / should return server status", async () => {
      const response = await request(app).get("/");

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe("Products API", () => {
    test("GET /api/products should return products list", async () => {
      const response = await request(app).get("/api/products");

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body).toHaveProperty("data");
    });
  });

  describe("404 Route", () => {
    test("Unknown route should return 404", async () => {
      const response = await request(app).get("/random-route");

      expect(response.statusCode).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe("Authentication API", () => {
    const user = {
      name: "Integration Test User",
      email: `test${Date.now()}@example.com`,
      password: "Password@123",
    };

    let accessToken = "";

    test("POST /api/auth/register should register a user", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send(user);

      expect(response.statusCode).toBe(201);
      expect(response.body.success).toBe(true);

      expect(response.body.data).toHaveProperty("user");
      expect(response.body.data).toHaveProperty("accessToken");
      expect(response.body.data).toHaveProperty("refreshToken");
    });

    test("POST /api/auth/login should login successfully", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: user.email,
          password: user.password,
        });

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);

      accessToken = response.body.data.accessToken;

      expect(accessToken).toBeDefined();
    });

    test("GET /api/auth/profile should return logged in user", async () => {
      const response = await request(app)
        .get("/api/auth/profile")
        .set("Authorization", `Bearer ${accessToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
    });

    test("GET /api/auth/profile without token should return 401", async () => {
      const response = await request(app).get("/api/auth/profile");

      expect(response.statusCode).toBe(401);
    });

    test("POST /api/auth/login with wrong password should fail", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: user.email,
          password: "WrongPassword@123",
        });

      expect(response.statusCode).toBe(401);
    });

    test("POST /api/auth/register with invalid password should fail", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send({
          name: "Test",
          email: `invalid${Date.now()}@example.com`,
          password: "123",
        });

      expect(response.statusCode).toBe(400);
    });
  });

});