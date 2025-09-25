import request from "supertest";
import mongoose from "mongoose";
import app from "../../src/app";
import User from "../../src/models/user.model";
import dotenv from "dotenv";
dotenv.config();

const TEST_DB =
  process.env.MONGO_URI_TEST || "mongodb://127.0.0.1:27017/tdd_register_test";



describe("POST /api/auth/login", () => {
  it("logs in a user with valid credentials and returns JWT", async () => {
    const email = "testlogin@example.com";
    const password = "Password123!";
    await request(app).post("/api/auth/register").send({ email, password });

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email, password })
      .expect(200);

    expect(res.body).toHaveProperty("token");
    expect(res.body).toHaveProperty("user");
    expect(res.body.user.email).toBe(email);
    expect(res.body.user).not.toHaveProperty("password");
  });

  it("rejects login with wrong password", async () => {
    const email = "wrongpass@example.com";
    const password = "Password123!";
    await request(app).post("/api/auth/register").send({ email, password });

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email, password: "wrongPass!" })
      .expect(401);

    expect(res.body).toHaveProperty("message");
  });

  it("rejects login for non-existing user", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "nouser@example.com", password: "Password123!" })
      .expect(401);

    expect(res.body).toHaveProperty("message");
  });
});
