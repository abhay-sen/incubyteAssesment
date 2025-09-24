import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/auth";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config();

const app = express();

app.use(express.json());
app.use("/api/auth", authRouter);

// global error handler
app.use(errorHandler);

export default app;
