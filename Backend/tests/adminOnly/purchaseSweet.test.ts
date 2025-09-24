import request from "supertest";
import mongoose from "mongoose";
import app from "../../src/app";
import jwt from "jsonwebtoken";
import Sweets from "../../src/models/sweets.model";

const JWT_SECRET = process.env.JWT_SECRET || "testsecret";
const generateToken = (
  payload = { id: "user1", email: "user@example.com", isAdmin: false }
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

describe("POST /api/sweets/:id/purchase - purchase sweet", () => {
  let sweetId: string;

  beforeEach(async () => {
    const sweet = await Sweets.create({
      name: "Lollipop",
      category: "Candy",
      price: 5,
      quantity_in_stock: 20,
      createdBy: { id: "user1" },
    })as mongoose.Document & { _id: mongoose.Types.ObjectId };
            sweetId = sweet._id.toString();
  });

  it("should allow a user to purchase sweet and reduce quantity", async () => {
    const token = generateToken();
    const purchaseQty = 5;

    const res = await request(app)
      .post(`/api/sweets/${sweetId}/purchase`)
      .set("Authorization", `Bearer ${token}`)
      .send({ quantity: purchaseQty })
      .expect(200);

    expect(res.body).toHaveProperty("message", "Purchase successful");
    expect(res.body.sweet.quantity_in_stock).toBe(15); // 20 - 5

    const updatedSweet = await Sweets.findById(sweetId);
    expect(updatedSweet?.quantity_in_stock).toBe(15);
  });

  it("should fail if requested quantity exceeds stock", async () => {
    const token = generateToken();
    const purchaseQty = 25; // more than stock

    const res = await request(app)
      .post(`/api/sweets/${sweetId}/purchase`)
      .set("Authorization", `Bearer ${token}`)
      .send({ quantity: purchaseQty })
      .expect(400);

    expect(res.body).toHaveProperty("message", "Insufficient stock");

    const updatedSweet = await Sweets.findById(sweetId);
    expect(updatedSweet?.quantity_in_stock).toBe(20); // unchanged
  });

  it("should deny access if user is not authenticated", async () => {
    const res = await request(app)
      .post(`/api/sweets/${sweetId}/purchase`)
      .send({ quantity: 2 })
      .expect(401);

    expect(res.body).toHaveProperty("message", "No token provided");
  });

  it("should return 404 if sweet not found", async () => {
    const token = generateToken();
    const fakeId = new mongoose.Types.ObjectId().toString();

    const res = await request(app)
      .post(`/api/sweets/${fakeId}/purchase`)
      .set("Authorization", `Bearer ${token}`)
      .send({ quantity: 2 })
      .expect(404);

    expect(res.body).toHaveProperty("message", "Sweet not found");
  });
});
