import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import Sweets from "../models/sweets.model";

const restockSweet = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    // Validate quantity
    if (!quantity || quantity <= 0) {
      return res
        .status(400)
        .json({ message: "Quantity must be greater than 0" });
    }

    // Find sweet by ID
    const sweet = await Sweets.findById(id);
    if (!sweet) {
      return res.status(404).json({ message: "Sweet not found" });
    }

    

    // Increase stock
    sweet.quantity_in_stock += quantity;
    await sweet.save();

    return res.json({
      message: "Restock successful",
      sweet,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export default restockSweet;
