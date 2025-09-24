import request from "supertest";
import mongoose from "mongoose";
import app from "../../src/app"; // Adjust the path as necessary
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "testsecret";
const generateToken = (
  payload = { id: "user1", email: "test@example.com", isAdmin: true }
) => jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

const MONGO_URI_TEST =
  process.env.MONGO_URI_TEST || "mongodb://127.0.0.1:27017/tdd_test";

beforeAll(async () => {
  await mongoose.connect(MONGO_URI_TEST);
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe("Admin Check Middleware", () => {
  it("should allow access for admin users", async () => {
    const token = generateToken();
    const res = await request(app)
      .get("/api/sweets/admin-only") // Replace with an actual admin-only route
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
  });

  it("should deny access for non-admin users", async () => {
    const token = generateToken({
      id: "user2",
      email: "user2@example.com",
      isAdmin: false,
    });
    const res = await request(app)
      .get("/api/sweets/admin-only") // Replace with your admin-only route
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty("message", "Access denied. Admins only.");
  });

  it("should deny access if token is missing", async () => {
    const res = await request(app).get("/api/sweets/admin-only"); // no token
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message", "No token provided");
  });

  it("should deny access if token is invalid", async () => {
    const res = await request(app)
      .get("/api/sweets/admin-only")
      .set("Authorization", "Bearer invalidtoken");
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message", "Invalid or expired token");
  });
});
