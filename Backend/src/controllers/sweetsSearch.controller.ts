import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import Sweets from "../models/sweets.model";

const searchSweets = async (req: AuthRequest, res: Response) => {
    try {
        const { name, category, minPrice, maxPrice } = req.query;
        const filter: any = {};
        
        if (name) {
            filter.name = { $regex: new RegExp(name as string, 'i') }; // case-insensitive partial match
        }
        if (category) {
            filter.category = category;
        }
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        const sweets = await Sweets.find(filter);
        return res.json({ count: sweets.length, sweets });
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};
export default searchSweets;