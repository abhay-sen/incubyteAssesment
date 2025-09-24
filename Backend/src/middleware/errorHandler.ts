import { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error(err);
  // mongoose duplicate key error fallback
  if (err && err.code === 11000) {
    return res.status(409).json({ message: "Duplicate key error" });
  }
  return res.status(500).json({ message: "Internal Server Error" });
}
