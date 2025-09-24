import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import {StringValue} from "ms";

const JWT_SECRET = process.env.JWT_SECRET as Secret;
const JWT_EXPIRES_IN: StringValue | number = (process.env.JWT_EXPIRES_IN || "1h") as StringValue;;


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

    const payload = { id: user._id, email: user.email,isAdmin:user.isAdmin };
    const options: SignOptions = { expiresIn: JWT_EXPIRES_IN };
    const token = jwt.sign(payload, JWT_SECRET, options);

    const userObj = user.toObject();
    delete (userObj as any).password;

    return res.status(201).json({ user: userObj, token });
  } catch (err) {
    next(err);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const match = await user.comparePassword(password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const payload = { id: user._id, email: user.email,isAdmin:user.isAdmin };
    const options: SignOptions = { expiresIn: JWT_EXPIRES_IN };
    const token = jwt.sign(payload, JWT_SECRET, options);

    const userObj = user.toObject();
    delete (userObj as any).password;

    return res.json({ token, user: userObj });
  } catch (err) {
    next(err);
  }
};
