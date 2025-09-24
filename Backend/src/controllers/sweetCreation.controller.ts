import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import Sweets from "../models/sweets.model";
const createSweet = async (req: AuthRequest, res: Response) => {
    try{
        const { name, category, price, quantity_in_stock } = req.body;
        if (!name || !category || !price || !quantity_in_stock) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const existing = await Sweets.findOne({ name, category });
        if(existing){
            return res.status(409).json({message: "Sweet with the same name and category already exists"});
        }
        const sweet = new Sweets({ name, category, price, quantity_in_stock, createdBy: req.user });
        await sweet.save();
        
        return res.json({
          message: "Sweet created successfully",
          sweet: { name, category, price, quantity_in_stock, createdBy: req.user },
        });
    }catch(err){
        res.status(500).json({message: "Internal Server Error"})
    }
};
export default createSweet;