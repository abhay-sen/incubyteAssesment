import request from "supertest";
import mongoose from "mongoose";
import app from "../../src/app"; // your express app
import jwt from "jsonwebtoken";
import Sweets from "../../src/models/sweets.model";
const JWT_SECRET = process.env.JWT_SECRET || "testsecret";

// Helper function to create JWT token
const generateToken = (
  payload = { id: "12345", email: "test@example.com" }
) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
};

beforeAll(async () => {
  await mongoose.connect("mongodb://127.0.0.1:27017/tdd_test");
});

afterEach(async () => {
  // clean up database if needed
  const collections = Object.keys(mongoose.connection.collections);
  for (const name of collections) {
    await mongoose.connection.collections[name].deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe("POST /api/sweets/", () => {
  it("should create sweet successfully with valid token and body", async () => {
    const token = generateToken();
    const payload = {
      name: "Chocolate",
      category: "Candy",
      price: 10,
      quantity_in_stock: 50,
      createdBy: { id: "user1" },
    };

    const res = await request(app)
      .post("/api/sweets/")
      .set("Authorization", `Bearer ${token}`)
      .send(payload)
      .expect(200);

    expect(res.body).toHaveProperty("message", "Sweet created successfully");
    expect(res.body).toHaveProperty("sweet");
    expect(res.body.sweet.name).toBe(payload.name);
    expect(res.body.sweet).toHaveProperty("createdBy");
  });

  it("should return 400 if required fields are missing", async () => {
    const token = generateToken();

    const res = await request(app)
      .post("/api/sweets/")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Candy" }) // missing other fields
      .expect(400);

    expect(res.body).toHaveProperty("message", "All fields are required");
  });

  it("should return 401 if token is missing", async () => {
    const payload = {
      name: "Chocolate",
      category: "Candy",
      price: 10,
      quantity_in_stock: 50,
      createdBy: { id: "user1" },
    };

    const res = await request(app).post("/api/sweets").send(payload).expect(401);

    expect(res.body).toHaveProperty("message", "No token provided");
  });

  it("should return 401 if token is invalid", async () => {
    const payload = {
      name: "Chocolate",
      category: "Candy",
      price: 10,
      quantity_in_stock: 50,
      createdBy: { id: "user1" },
    };

    const res = await request(app)
      .post("/api/sweets/")
      .set("Authorization", "Bearer invalidtoken")
      .send(payload)
      .expect(401);

    expect(res.body).toHaveProperty("message", "Invalid or expired token");
  });
  it("should create sweet successfully with valid token and body", async () => {
    const token = generateToken({ id: "user1", email: "test@example.com" });
    const payload = {
      name: "Chocolate",
      category: "Candy",
      price: 10,
      quantity_in_stock: 50,
      createdBy: { id: "user1" },
    };

    const res = await request(app)
      .post("/api/sweets/")
      .set("Authorization", `Bearer ${token}`)
      .send(payload)
      .expect(200);

    expect(res.body).toHaveProperty("message", "Sweet created successfully");
    expect(res.body.sweet.name).toBe(payload.name);
    expect(res.body.sweet.createdBy).toMatchObject({
      id: "user1",
      email: "test@example.com",
    });

    // Optional: check DB
    const sweetInDb = await Sweets.findOne({
      name: "Chocolate",
      category: "Candy",
    });
    expect(sweetInDb).not.toBeNull();
  });
  it("should return 409 if sweet with same name and category exists", async () => {
    const token = generateToken();
    await new Sweets({
      name: "Chocolate",
      category: "Candy",
      price: 10,
      quantity_in_stock: 50,
      createdBy: { id: "user1" },
    }).save();

    const res = await request(app)
      .post("/api/sweets/")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Chocolate",
        category: "Candy",
        price: 15,
        quantity_in_stock: 30,
        createdBy: { id: "user1" },
      })
      .expect(409);

    expect(res.body).toHaveProperty(
      "message",
      "Sweet with the same name and category already exists"
    );
  });

});
