import request from "supertest";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import app from "../../src/app";
import User from "../../src/models/user.model";
import dotenv from "dotenv";
dotenv.config();

const TEST_DB =
  process.env.MONGO_URI_TEST || "mongodb://127.0.0.1:27017/tdd_register_test";

beforeAll(async () => {
  await mongoose.connect(TEST_DB);
});

afterEach(async () => {
  // clear collections
  const collections = Object.keys(mongoose.connection.collections);
  for (const name of collections) {
    await mongoose.connection.collections[name].deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe("POST /api/auth/register", () => {
  it("creates a user, returns 201 with user payload and token", async () => {
    const payload = {
      name: "Abhay",
      email: "test1@example.com",
      password: "Password123!",
    };

    const res = await request(app)
      .post("/api/auth/register")
      .send(payload)
      .expect(201);

    expect(res.body).toHaveProperty("user");
    expect(res.body).toHaveProperty("token");
    expect(res.body.user.email).toBe(payload.email);
    expect(res.body.user).not.toHaveProperty("password");
  });


  it("returns 400 when email is invalid or password too short", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: "not-an-email", password: "short" })
      .expect(400);

    expect(res.body).toHaveProperty("errors");
    expect(Array.isArray(res.body.errors)).toBe(true);
  });

  it("returns 409 when email already exists", async () => {
    const payload = {
      name: "X",
      email: "duplicate@example.com",
      password: "Password123!",
    };
    // create user directly
    await new User({
      name: payload.name,
      email: payload.email,
      password: payload.password,
    }).save();

    const res = await request(app)
      .post("/api/auth/register")
      .send(payload)
      .expect(409);
    expect(res.body).toHaveProperty("message");
  });
});
