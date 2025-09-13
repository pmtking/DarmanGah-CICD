"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginSuperAdmin = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const Developer_1 = require("../models/Developer");
const usbMountPath = "I:\\";
const filename = "superadmin.key";
const filePath = path_1.default.join(usbMountPath, filename);
const generateAccessKey = () => {
    return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
};
const LoginSuperAdmin = async (req, res) => {
    try {
        // بررسی وجود فایل روی فلش
        if (!fs_1.default.existsSync(filePath)) {
            return res.status(404).json({ message: "🔑 فایل کلید روی فلش پیدا نشد" });
        }
        // تولید کلید جدید
        const newAccessKey = generateAccessKey();
        // نوشتن کلید جدید داخل فایل
        fs_1.default.writeFileSync(filePath, newAccessKey, "utf-8");
        // بررسی وجود کاربر تستی
        let admin = await Developer_1.Developer.findOne({ username: "testadmin" });
        if (admin) {
            admin.accesskey = newAccessKey;
            admin.isSuperAdmin = true;
            await admin.save();
        }
        else {
            admin = new Developer_1.Developer({
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
    }
    catch (error) {
        console.error("❗️ خطا در لاگین:", error);
        return res.status(500).json({ message: "خطا در سرور" });
    }
};
exports.LoginSuperAdmin = LoginSuperAdmin;
