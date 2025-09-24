// src/routes/protected.ts
import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.get("/profile", authenticate, (req, res) => {
  res.json({ message: "Welcome to your profile!", user: (req as any).user });
});

export default router;
