"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
// utils/upload.ts
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// مسیر ذخیره‌سازی عکس‌ها
const uploadPath = path_1.default.join(__dirname, "../uploads/avatars");
// ایجاد پوشه در صورت عدم وجود
if (!fs_1.default.existsSync(uploadPath)) {
    fs_1.default.mkdirSync(uploadPath, { recursive: true });
}
// تنظیمات ذخیره‌سازی
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const ext = path_1.default.extname(file.originalname).toLowerCase(); // پسوند فایل
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
        cb(null, uniqueName);
    },
});
// محدود کردن نوع فایل به عکس
const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error("فقط فایل‌های تصویری (jpg, jpeg, png, webp) مجاز هستند."));
    }
};
// حداکثر حجم فایل (مثلاً 5 مگابایت)
const limits = { fileSize: 10 * 1024 * 1024 }; // 10 MB
// ایجاد middleware آپلود
exports.upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits,
});
