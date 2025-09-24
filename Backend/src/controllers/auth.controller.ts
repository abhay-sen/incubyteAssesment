import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password } = req.body;

    // check duplicate
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(409).json({ message: "Email already in use" });

    const user = new User({ name, email, password });
    await user.save();

    const userObj = user.toObject();
    delete (userObj as any).password;

    return res.status(201).json({ user: userObj });
  } catch (err) {
    next(err);
  }
};
