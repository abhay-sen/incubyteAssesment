// src/routes/protected.ts
import { Router } from "express";
import { authenticate,AuthRequest } from "../middleware/auth.middleware";
import { adminCheck } from "../middleware/adminCheck.middleware";
import createSweet from "../controllers/sweetCreation.controller";
import getAllSweets from "../controllers/listOfAllAvailSweets.controller";
import searchSweets from "../controllers/sweetsSearch.controller";
import updateSweet from "../controllers/sweetUpdate.controller";
const router = Router();

router.use(authenticate)//applies authentication for all the routes below
router.post("/",createSweet);
router.get("/search",searchSweets);
router.get("/",getAllSweets);
router.use(adminCheck);//applies admin check for all the routes below
router.put("/:id",updateSweet);


export default router;
