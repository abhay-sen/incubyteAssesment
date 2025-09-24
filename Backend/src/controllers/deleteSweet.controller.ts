import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import Sweets from "../models/sweets.model";

const deleteSweet = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Find the sweet by ID
    const sweet = await Sweets.findById(id);
    if (!sweet) {
      return res.status(404).json({ message: "Sweet not found" });
    }

    await sweet.deleteOne();

    return res.json({ message: "Sweet deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export default deleteSweet;
