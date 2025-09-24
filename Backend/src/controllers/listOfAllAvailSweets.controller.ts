import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import Sweets from "../models/sweets.model";
const getAllSweets = async (req: AuthRequest, res: Response) => {
    try{
        const sweets = await Sweets.find();
        return res.json({ sweets });
    }catch(err){
        res.status(500).json({message: "Internal Server Error"})
    }
};
export default getAllSweets;