// src/middleware/auth.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { IUserAuth } from "../models/UserAuth";


const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "توکن احراز هویت یافت نشد." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as IUserAuth;
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "توکن نامعتبر است." });
  }
}
