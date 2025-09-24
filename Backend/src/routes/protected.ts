// src/routes/protected.ts
import { Router } from "express";
import { authenticate,AuthRequest } from "../middleware/auth.middleware";
import { adminCheck } from "../middleware/adminCheck.middleware";
import createSweet from "../controllers/sweetCreation.controller";
import getAllSweets from "../controllers/listOfAllAvailSweets.controller";
import searchSweets from "../controllers/sweetsSearch.controller";
const router = Router();


router.post("/",authenticate,createSweet);
router.get("/search",authenticate,searchSweets);
router.get("/",authenticate,getAllSweets);
router.get("/admin-only",authenticate,adminCheck,(req, res) => {
  res.json({ message: "Welcome, admin!" });
})
export default router;
