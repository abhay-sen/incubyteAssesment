import request from "supertest";
import mongoose from "mongoose";
import app from "../../src/app";
import jwt from "jsonwebtoken";
import Sweets from "../../src/models/sweets.model";

const JWT_SECRET = process.env.JWT_SECRET || "testsecret";
const generateToken = (
  payload = { id: "admin1", email: "admin@example.com", isAdmin: true }
) => jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

const MONGO_URI_TEST =
  process.env.MONGO_URI_TEST || "mongodb://127.0.0.1:27017/tdd_test";

beforeAll(async () => {
  await mongoose.connect(MONGO_URI_TEST);
});

afterEach(async () => {
  await Sweets.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe("POST /api/sweets/:id/restock - restock sweet (admin only)", () => {
  let sweetId: string;

  beforeEach(async () => {
    const sweet = (await Sweets.create({
      name: "Lollipop",
      category: "Candy",
      price: 5,
      quantity_in_stock: 20,
      createdBy: { id: "user1" },
    })) as mongoose.Document & { _id: mongoose.Types.ObjectId };
    sweetId = sweet._id.toString();
  });

  it("should allow admin to restock sweet", async () => {
    const token = generateToken();
    const restockQty = 5;

    const res = await request(app)
      .post(`/api/sweets/${sweetId}/restock`)
      .set("Authorization", `Bearer ${token}`)
      .send({ quantity: restockQty })
      .expect(200);

    expect(res.body).toHaveProperty("message", "Restock successful");
    expect(res.body.sweet.quantity_in_stock).toBe(25); // 20 + 5

    const updatedSweet = await Sweets.findById(sweetId);
    expect(updatedSweet?.quantity_in_stock).toBe(25);
  });

  it("should deny access for non-admin users", async () => {
    const token = generateToken({
      id: "user2",
      email: "user2@example.com",
      isAdmin: false,
    });

    const res = await request(app)
      .post(`/api/sweets/${sweetId}/restock`)
      .set("Authorization", `Bearer ${token}`)
      .send({ quantity: 5 })
      .expect(403);

    expect(res.body).toHaveProperty("message", "Access denied. Admins only.");

    const sweet = await Sweets.findById(sweetId);
    expect(sweet?.quantity_in_stock).toBe(20); // unchanged
  });

  it("should deny access if user is not authenticated", async () => {
    const res = await request(app)
      .post(`/api/sweets/${sweetId}/restock`)
      .send({ quantity: 2 })
      .expect(401);

    expect(res.body).toHaveProperty("message", "No token provided");
  });

  it("should return 404 if sweet not found", async () => {
    const token = generateToken();
    const fakeId = new mongoose.Types.ObjectId().toString();

    const res = await request(app)
      .post(`/api/sweets/${fakeId}/restock`)
      .set("Authorization", `Bearer ${token}`)
      .send({ quantity: 2 })
      .expect(404);

    expect(res.body).toHaveProperty("message", "Sweet not found");
  });
});
