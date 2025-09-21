// src/middleware/isManager.ts
import { Request, Response, NextFunction } from "express";

export function isManager(req: Request, res: Response, next: NextFunction) {
  const user = req.user; // فرض بر اینه که auth middleware قبلاً اجرا شده

  if (!user || user.role !== "MANAGER") {
    return res
      .status(403)
      .json({ message: "دسترسی غیرمجاز. فقط مدیر مجاز است." });
  }

  next();
}
