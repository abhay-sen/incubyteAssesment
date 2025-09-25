// tests/sweetsSearch.test.ts
import request from "supertest";
import mongoose from "mongoose";
import app from "../../src/app"; // Adjust the path as necessary";
import jwt from "jsonwebtoken";
import Sweets from "../../src/models/sweets.model";

const JWT_SECRET = process.env.JWT_SECRET || "testsecret";
const generateToken = (payload = { id: "user1", email: "test@example.com" }) =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });



describe("GET /api/sweets/search", () => {
  beforeEach(async () => {
    await Sweets.insertMany([
      {
        name: "Chocolate",
        category: "Candy",
        price: 10,
        quantity_in_stock: 50,
        createdBy: { id: "user1" },
      },
      {
        name: "Gummy Bears",
        category: "Candy",
        price: 5,
        quantity_in_stock: 30,
        createdBy: { id: "user2" },
      },
      {
        name: "Caramel",
        category: "Candy",
        price: 15,
        quantity_in_stock: 20,
        createdBy: { id: "user1" },
      },
      {
        name: "Lollipop",
        category: "Sweet",
        price: 2,
        quantity_in_stock: 100,
        createdBy: { id: "user2" },
      },
    ]);
  });

  it("should return all sweets if no query params are provided", async () => {
    const token = generateToken();
    const res = await request(app)
      .get("/api/sweets/search")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(res.body.count).toBe(4);
  });

  it("should search by name (partial match, case-insensitive)", async () => {
    const token = generateToken();
    const res = await request(app)
      .get("/api/sweets/search?name=choco")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(res.body.count).toBe(1);
    expect(res.body.sweets[0].name).toBe("Chocolate");
  });

  it("should filter by category", async () => {
    const token = generateToken();
    const res = await request(app)
      .get("/api/sweets/search?category=Candy")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(res.body.count).toBe(3);
    res.body.sweets.forEach((s: any) => expect(s.category).toBe("Candy"));
  });

  it("should filter by price range", async () => {
    const token = generateToken();
    const res = await request(app)
      .get("/api/sweets/search?minPrice=5&maxPrice=10")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(res.body.count).toBe(2);
    res.body.sweets.forEach((s: any) =>
      expect(s.price).toBeGreaterThanOrEqual(5)
    );
    res.body.sweets.forEach((s: any) =>
      expect(s.price).toBeLessThanOrEqual(10)
    );
  });

  it("should return 401 if token is missing", async () => {
    await request(app).get("/api/sweets/search").expect(401);
  });
  it("should return 401 if token is invalid", async () => {
    const token = "invalidtoken";
    await request(app)
      .get("/api/sweets/search")
      .set("Authorization", `Bearer ${token}`)
      .expect(401);
    
  });
  it("should return empty array if no sweets match", async () => {
    const token = generateToken();
    const res = await request(app)
      .get("/api/sweets/search?name=nonexistent")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(res.body.count).toBe(0);
    expect(res.body.sweets).toEqual([]);
  });
});
