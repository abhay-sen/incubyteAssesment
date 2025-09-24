import request from "supertest";
import mongoose from "mongoose";
import app from "../../src/app"; // your express app
import jwt from "jsonwebtoken";
import Sweets from "../../src/models/sweets.model";

const JWT_SECRET = process.env.JWT_SECRET || 'testsecret';
//function that creates jwt token
const generateToken = (
  payload = { id: "12345", email: "test@example.com" }
) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
};

const MONGO_URI_TEST = process.env.MONGO_URI_TEST || "mongodb://localhost:27017/test";

beforeAll(async () => {
  await mongoose.connect(MONGO_URI_TEST);
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
    it("should get all sweets successfully with valid token", async () => {
        const token = generateToken();
        // Pre-insert some sweets
        const sweetsData = [
            { name: "Chocolate", category: "Candy", price: 10, quantity_in_stock: 50, createdBy: { id: "user1" } },
            { name: "Gummy Bears", category: "Candy", price: 5, quantity_in_stock: 100, createdBy: { id: "user2" } },
        ];
        await Sweets.insertMany(sweetsData);
    
        const res = await request(app)
          .get("/api/sweets/")
          .set("Authorization", `Bearer ${token}`)
          .expect(200);
    
        expect(res.body).toHaveProperty("sweets");
        expect(Array.isArray(res.body.sweets)).toBe(true);
        expect(res.body.sweets.length).toBe(2);
        expect(res.body.sweets[0]).toHaveProperty("name", "Chocolate");
        expect(res.body.sweets[1]).toHaveProperty("name", "Gummy Bears");
      });
    
      it("should return 401 if token is missing", async () => {
        const res = await request(app)
          .get("/api/sweets/")
          .expect(401);
    
        expect(res.body).toHaveProperty("message", "No token provided");
      });
    
      it("should return 401 if token is invalid", async () => {
        const res = await request(app)
          .get("/api/sweets/")
          .set("Authorization", `Bearer invalidtoken`)
          .expect(401);
    
        expect(res.body).toHaveProperty("message", "Invalid or expired token");
      });
});
