import { Request, Response } from "express";
import path from "path";
import fs from "fs";
import { Developer } from "../models/Developer";

const usbMountPath = "I:\\";
const filename = "superadmin.key";
const filePath = path.join(usbMountPath, filename);

const generateAccessKey = (): string => {
  return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
};

export const LoginSuperAdmin = async (req: Request, res: Response) => {
  try {
    // بررسی وجود فایل روی فلش
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "🔑 فایل کلید روی فلش پیدا نشد" });
    }

    // تولید کلید جدید
    const newAccessKey = generateAccessKey();

    // نوشتن کلید جدید داخل فایل
    fs.writeFileSync(filePath, newAccessKey, "utf-8");

    // بررسی وجود کاربر تستی
    let admin = await Developer.findOne({ username: "testadmin" });

    if (admin) {
      admin.accesskey = newAccessKey;
      admin.isSuperAdmin = true;
      await admin.save();
    } else {
      admin = new Developer({
        username: "testadmin",
        password: "changeme123",
        accesskey: newAccessKey,
        isSuperAdmin: true,
      });
      await admin.save();
    }

    return res.status(200).json({
      message: "✅ ورود موفق و کلید جدید ذخیره شد",
      user: {
        username: admin.username,
        accesskey: admin.accesskey,
        isSuperAdmin: admin.isSuperAdmin,
      },
    });
  } catch (error) {
    console.error("❗️ خطا در لاگین:", error);
    return res.status(500).json({ message: "خطا در سرور" });
  }
};
