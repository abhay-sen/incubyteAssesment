import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/tdd_register_dev";

export default async function connectDB() {
  await mongoose.connect(MONGO_URI);
  console.log("MongoDB connected");
}
