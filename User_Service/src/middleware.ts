import jwt, { type JwtPayload } from "jsonwebtoken";
import type { NextFunction, Response } from "express";
import type { Iuser } from "./model.js";
import { User } from "./model.js";
import type { Request } from "express";

// Extend Request to add user
export interface AuthenticatedRequest extends Request {
  user?: Iuser | null;
}

export const isAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // ✅ 1. Read token safely
    const token = req.headers.token as string;

    if (!token) {
      res.status(401).json({ message: "Please login" });
      return;
    }

    // ✅ 2. Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload & { _id: string };

    // ✅ 3. Find user (DO NOT select password)
    const user = await User.findById(decoded._id).select("-password"); 

    if (!user) {
      res.status(401).json({ message: "User not found" });
      return;
    }

    // ✅ 4. Attach user to request
    req.user = user;

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
