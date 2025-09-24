// src/routes/protected.ts
import { Router } from "express";
import { authenticate,AuthRequest } from "../middleware/auth.middleware";
import { adminCheck } from "../middleware/adminCheck.middleware";
import createSweet from "../controllers/sweetCreation.controller";
import getAllSweets from "../controllers/listOfAllAvailSweets.controller";
import searchSweets from "../controllers/sweetsSearch.controller";
import updateSweet from "../controllers/sweetUpdate.controller";
import deleteSweet from "../controllers/deleteSweet.controller";
import purchaseSweet from "../controllers/purchaseSweet.controller";
import restockSweet from "../controllers/restock.controller";
const router = Router();

router.use(authenticate)//applies authentication for all the routes below
router.post("/",createSweet);
router.get("/search",searchSweets);
router.get("/",getAllSweets);
router.post("/:id/purchase",purchaseSweet);
router.use(adminCheck);//applies admin check for all the routes below
router.put("/:id",updateSweet);
router.delete("/:id",deleteSweet);
router.post("/:id/restock",restockSweet);

export default router;
