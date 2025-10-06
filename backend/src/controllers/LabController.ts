import { Request, Response, NextFunction } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { toJalaali } from "jalaali-js";

// مسیر اصلی ذخیره فایل‌ها
const UPLOAD_DIR = "/home/ubuntu-website/lab/";

if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// گرفتن مسیر بر اساس تاریخ شمسی
const getTodayPath = () => {
  const now = new Date();
  const { jy, jm, jd } = toJalaali(now.getFullYear(), now.getMonth() + 1, now.getDate());
  // نمونه: /home/ubuntu-website/lab/2-7-1404
  const todayPath = path.join(UPLOAD_DIR, `${jd}-${jm}-${jy}`);
  if (!fs.existsSync(todayPath)) fs.mkdirSync(todayPath, { recursive: true });
  return todayPath;
};

// تنظیمات multer
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, getTodayPath());
  },
  filename: (req, file, cb) => {
    const codeMelli = path.parse(file.originalname).name.trim();
    if (!codeMelli) return cb(new Error("نام فایل معتبر نیست و کد ملی استخراج نشد."));
    cb(null, `${codeMelli}.pdf`); // فایل با نام کد ملی ذخیره شود
  },
});

export const upload = multer({ storage }).array("files", 100);

export const handleMulterError = (
  err: any,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof multer.MulterError)
    return res.status(400).json({ error: err.message });
  else if (err)
    return res.status(400).json({ error: err.message || "خطای سرور در آپلود فایل" });
  next();
};

export const uploadFiles = (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[];
  if (!files || files.length === 0)
    return res.status(400).json({ error: "هیچ فایلی ارسال نشده است." });

  res.json({
    message: `✅ ${files.length} فایل با موفقیت آپلود شد.`,
    files: files.map(f => ({ name: path.basename(f.path), path: f.path })),
  });
};

// جستجوی فایل‌ها بر اساس کد ملی
export const getFileByCodeMelli = (codeMelli: string) => {
  // جستجو در تمام پوشه‌های تاریخ شمسی
  const dates = fs.readdirSync(UPLOAD_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => path.join(UPLOAD_DIR, d.name));

  for (const datePath of dates) {
    const filePath = path.join(datePath, `${codeMelli}.pdf`);
    if (fs.existsSync(filePath)) return filePath;
  }
  return null;
};
