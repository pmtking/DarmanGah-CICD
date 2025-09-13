"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifySuperAdmin = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const Developer_1 = require("../models/Developer");
const usbMountPath = "D:\\";
const filename = "superadmin.key";
const filePath = path_1.default.join(usbMountPath, filename);
const verifySuperAdmin = async (req, res, next) => {
    try {
        // برسی وجود فایل روی فلش
        if (!fs_1.default.existsSync(filePath)) {
            return res
                .status(403)
                .json({ message: "🔐 فایل کلید سوپر ادمین روی USB پیدا نشد" });
        }
        // خواندن کلید از فایل
        const usbKey = fs_1.default.readFileSync(filePath, "utf-8").trim();
        const admin = await Developer_1.Developer.findOne({
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
    }
    catch (error) {
        console.error("❗️ خطا در احراز هویت USB:", error);
        return res.status(500).json({ message: "خطا در سرور هنگام بررسی USB" });
    }
};
exports.verifySuperAdmin = verifySuperAdmin;
