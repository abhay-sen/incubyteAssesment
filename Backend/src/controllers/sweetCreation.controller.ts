import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";

const createSweet = (req: AuthRequest, res: Response) => {
    const {name,category,price,quantity_in_stock} = req.body;
    if(!name || !category || !price || !quantity_in_stock){
        return res.status(400).json({message:"All fields are required"});
    }
    
    return res.json({
        message:"Sweet created successfully",
        sweet:{name,category,price,quantity_in_stock},
        submittedBy: req.user
    });
};
export default createSweet;