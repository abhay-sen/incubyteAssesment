import { Request,Response,NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";

export const adminCheck = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (typeof req.user === "object" && req.user !== null && "isAdmin" in req.user && (req.user as any).isAdmin) {
        // User is admin, proceed
        next();
    } else {
        // User is not admin, deny access
        res.status(403).json({ message: "Access denied. Admins only." });
    }
};