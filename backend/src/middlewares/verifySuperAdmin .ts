import { Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";
import { Developer } from "../models/Developer";
const usbMountPath = "D:\\";
const filename = "superadmin.key";
const filePath = path.join(usbMountPath, filename);
export const verifySuperAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // برسی وجود فایل روی فلش
    if (!fs.existsSync(filePath)) {
      return res
        .status(403)
        .json({ message: "🔐 فایل کلید سوپر ادمین روی USB پیدا نشد" });
    }
    // خواندن کلید از فایل
    const usbKey = fs.readFileSync(filePath, "utf-8").trim();
    const admin = await Developer.findOne({
      accesskey: usbKey,
      isSuperAdmin: true,
    });
    if (!admin) {
      return res.status(401).json({
        message: "کاربر ادمین یافت نشد",
      });
    }
    req.user = {
      id: admin._id,
      username: admin.username,
      isSuperAdmin: true,
    };
    next();
  } catch (error) {
    console.error("❗️ خطا در احراز هویت USB:", error);
    return res.status(500).json({ message: "خطا در سرور هنگام بررسی USB" });
  }
};
