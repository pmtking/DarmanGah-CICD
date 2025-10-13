import { Request, Response, NextFunction } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { toJalaali } from "jalaali-js";

// مسیر اصلی ذخیره فایل‌ها
const UPLOAD_DIR = "/home/ubuntu-website/lab";

if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// گرفتن مسیر امروز به شمسی
const getTodayPath = (): string => {
  const now = new Date();
  const { jy, jm, jd } = toJalaali(now.getFullYear(), now.getMonth() + 1, now.getDate());
  const todayPath = path.join(UPLOAD_DIR, `${jd}-${jm}-${jy}`);
  if (!fs.existsSync(todayPath)) fs.mkdirSync(todayPath, { recursive: true });
  return todayPath;
};

// تنظیمات ذخیره سازی multer
const storage = multer.diskStorage({
  destination: (_req, file, cb) => {
    const todayPath = getTodayPath();
    const codeMelli = path.parse(file.originalname).name.trim();
    if (!codeMelli) return cb(new Error("کد ملی از نام فایل استخراج نشد."));

    const userDir = path.join(todayPath, codeMelli);
    if (!fs.existsSync(userDir)) fs.mkdirSync(userDir, { recursive: true });

    cb(null, userDir);
  },
  filename: (_req, file, cb) => {
    const codeMelli = path.parse(file.originalname).name.trim();
    const userDir = path.join(getTodayPath(), codeMelli);

    const existingFiles = fs.existsSync(userDir)
      ? fs.readdirSync(userDir).filter(f => f.endsWith(".pdf"))
      : [];
    const testNumber = existingFiles.length + 1;
    cb(null, `${testNumber}.pdf`);
  },
});

// Multer برای چند فایل همزمان (حداکثر 100 فایل و حجم 50MB برای هر فایل)
export const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
}).array("files", 100);

// مدیریت خطاهای multer
export const handleMulterError = (
  err: any,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof multer.MulterError)
    return res.status(400).json({ error: err.message });
  if (err) return res.status(400).json({ error: err.message || "خطای سرور در آپلود فایل" });
  next();
};

// کنترلر آپلود چند فایل
export const uploadFiles = (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[];
  if (!files || files.length === 0)
    return res.status(400).json({ error: "هیچ فایلی ارسال نشده است." });

  const uploadedFiles = files.map(f => ({
    name: path.basename(f.path),
    path: path.relative(UPLOAD_DIR, f.path),
  }));

  res.json({
    message: `✅ ${files.length} فایل با موفقیت آپلود شد.`,
    files: uploadedFiles,
  });
};

// جستجوی فایل‌ها بر اساس کد ملی و شماره آزمایش (اختیاری)
// جستجوی فایل‌ها به صورت بازگشتی بر اساس کد ملی
const findFilesRecursively = (dir: string, codeMelli: string): string[] => {
  let results: string[] = [];
  if (!fs.existsSync(dir)) return results;

  const list = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of list) {
    const fullPath = path.join(dir, item.name);

    if (item.isDirectory()) {
      results = results.concat(findFilesRecursively(fullPath, codeMelli));
    } else if (
      item.isFile() &&
      fullPath.endsWith(".pdf") &&
      fullPath.split(path.sep).includes(codeMelli)
    ) {
      results.push(fullPath);
    }
  }

  return results;
};

// دریافت فایل‌ها بر اساس کد ملی
export const getFilesByCodeMelli = (req: Request, res: Response) => {
  const codeMelli = req.body?.codeMelli?.trim();
  if (!codeMelli)
    return res.status(400).json({ error: "کد ملی ارسال نشده است." });

  const matchedFiles = findFilesRecursively(UPLOAD_DIR, codeMelli);
  if (matchedFiles.length === 0)
    return res.status(404).json({ message: "فایلی برای این کد ملی پیدا نشد." });

  const filesData = matchedFiles.map(filePath => {
    const relativePath = path.relative(UPLOAD_DIR, filePath);
    const parts = relativePath.split(path.sep);
    const dateFolder = parts.length > 1 ? parts[0] : "نامشخص";

    return {
      name: path.basename(filePath),
      path: relativePath,
      dateFolder, // پوشه روز
    };
  });

  res.json({ files: filesData });
};

