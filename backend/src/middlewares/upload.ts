// utils/upload.ts
import multer from "multer";
import path from "path";
import fs from "fs";

// مسیر ذخیره‌سازی عکس‌ها
const uploadPath = path.join(__dirname, "../uploads/avatars");

// ایجاد پوشه در صورت عدم وجود
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// تنظیمات ذخیره‌سازی
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase(); // پسوند فایل
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

// محدود کردن نوع فایل به عکس
const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "فقط فایل‌های تصویری (jpg, jpeg, png, webp) مجاز هستند."
      )
    );
  }
};

// حداکثر حجم فایل (مثلاً 5 مگابایت)
const limits = { fileSize: 70 * 1024 * 1024 };

// ایجاد middleware آپلود
export const upload = multer({
  storage,
  fileFilter,
  limits,
});
