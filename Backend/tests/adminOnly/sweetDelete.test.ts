import request from "supertest";
import mongoose from "mongoose";
import app from "../../src/app"; // adjust path
import jwt from "jsonwebtoken";
import Sweets from "../../src/models/sweets.model";

const JWT_SECRET = process.env.JWT_SECRET || "testsecret";
const generateToken = (
  payload = { id: "admin1", email: "admin@example.com", isAdmin: true }
) => jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

const MONGO_URI_TEST =
  process.env.MONGO_URI_TEST || "mongodb://127.0.0.1:27017/tdd_test";



describe("DELETE /api/sweets/:id - delete sweet", () => {
  let sweetId: string;

  beforeEach(async () => {
    const sweet = await Sweets.create({
      name: "Caramel",
      category: "Candy",
      price: 15,
      quantity_in_stock: 20,
      createdBy: { id: "user1" },
    }) as mongoose.Document & { _id: mongoose.Types.ObjectId };
        sweetId = sweet._id.toString();
  });

  it("should delete sweet successfully for admin user", async () => {
    const token = generateToken();

    const res = await request(app)
      .delete(`/api/sweets/${sweetId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(res.body).toHaveProperty("message", "Sweet deleted successfully");

    // Confirm DB deletion
    const deletedSweet = await Sweets.findById(sweetId);
    expect(deletedSweet).toBeNull();
  });

  it("should deny access for non-admin user", async () => {
    const token = generateToken({
      id: "user2",
      email: "user2@example.com",
      isAdmin: false,
    });

    const res = await request(app)
      .delete(`/api/sweets/${sweetId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(403);

    expect(res.body).toHaveProperty("message", "Access denied. Admins only.");
  });

  it("should deny access if token is missing", async () => {
    const res = await request(app).delete(`/api/sweets/${sweetId}`).expect(401);

    expect(res.body).toHaveProperty("message", "No token provided");
  });

  it("should return 404 if sweet not found", async () => {
    const token = generateToken();
    const fakeId = new mongoose.Types.ObjectId().toString();

    const res = await request(app)
      .delete(`/api/sweets/${fakeId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(404);

    expect(res.body).toHaveProperty("message", "Sweet not found");
  });
});
