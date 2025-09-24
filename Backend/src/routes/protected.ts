// src/routes/protected.ts
import { Router } from "express";
import { authenticate,AuthRequest } from "../middleware/auth.middleware";
import createSweet from "../controllers/sweetCreation.controller";
import getAllSweets from "../controllers/listOfAllAvailSweets.controller";
const router = Router();

router.get("/profile", authenticate, (req: AuthRequest, res) => {
    res.json({ message: "Welcome to your profile!", user: req.user });
});
router.post("/",authenticate,createSweet);
router.get("/",authenticate,getAllSweets);
export default router;
