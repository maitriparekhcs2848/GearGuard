import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserService } from "../services/user.service";

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const decoded = jwt.verify(token, "your-secret-key") as { id: string };
    const user = UserService.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    (req as any).user = user;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};