import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/auth";
import { errorHandler } from "./middleware/errorHandler";
import protectedRouter from "./routes/protected";
import cors from "cors";

dotenv.config();

const app = express();

// Global CORS middleware
app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // if using cookies or auth headers
  })
);

app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/sweets", protectedRouter);

// Global error handler
app.use(errorHandler);

export default app;
