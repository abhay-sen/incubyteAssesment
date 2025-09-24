import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import Sweets from "../models/sweets.model";

const updateSweet = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, category, price, quantity_in_stock } = req.body;

    // Find the sweet by ID
    const sweet = await Sweets.findById(id);
    if (!sweet) {
      return res.status(404).json({ message: "Sweet not found" });
    }

    // Update only provided fields
    if (name !== undefined) sweet.name = name;
    if (category !== undefined) sweet.category = category;
    if (price !== undefined) sweet.price = price;
    if (quantity_in_stock !== undefined)
      sweet.quantity_in_stock = quantity_in_stock;

    await sweet.save();

    return res.json({
      message: "Sweet updated successfully",
      sweet,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export default updateSweet;
