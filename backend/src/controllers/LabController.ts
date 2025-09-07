import { Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

// مسیر ذخیره فایل‌ها
const UPLOAD_DIR = "/home/ubuntu-website/";

// اطمینان از وجود پوشه
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// تنظیمات multer
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

export const upload = multer({ storage });

// کنترلر برای دریافت فایل‌ها
export const uploadFiles = (
  req: Request<{}, {}, {}, {}>,
  res: Response
) => {
  const files = req.files as Express.Multer.File[] | undefined;

  if (!files || files.length === 0) {
    return res.status(400).json({ error: "هیچ فایلی ارسال نشده است." });
  }

  const uploadedFiles = files.map((file) => file.filename);

  res.json({
    message: "✅ فایل‌ها با موفقیت آپلود شدند.",
    files: uploadedFiles,
  });
};
