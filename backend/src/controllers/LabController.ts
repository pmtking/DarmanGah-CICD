import { Request, Response, NextFunction } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { toJalaali } from "jalaali-js";

// مسیر اصلی ذخیره فایل‌ها
const UPLOAD_DIR = "/home/ubuntu-website/lab/";

if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// گرفتن مسیر امروز به شمسی
const getTodayPath = () => {
  const now = new Date();
  const { jy, jm, jd } = toJalaali(now.getFullYear(), now.getMonth() + 1, now.getDate());
  const todayPath = path.join(UPLOAD_DIR, `${jd}-${jm}-${jy}`);
  if (!fs.existsSync(todayPath)) fs.mkdirSync(todayPath, { recursive: true });
  return todayPath;
};

// تنظیمات multer
const storage = multer.diskStorage({
  destination: (_req, file, cb) => {
    const todayPath = getTodayPath();
    const codeMelli = path.parse(file.originalname).name.trim();
    if (!codeMelli) return cb(new Error("کد ملی از نام فایل استخراج نشد."));

    const userDir = path.join(todayPath, codeMelli);
    if (!fs.existsSync(userDir)) fs.mkdirSync(userDir, { recursive: true });

    cb(null, userDir); // مسیر نهایی: {UPLOAD_DIR}/{تاریخ}/{کدملی}/
  },
  filename: (_req, file, cb) => {
    const codeMelli = path.parse(file.originalname).name.trim();
    const todayPath = getTodayPath();
    const userDir = path.join(todayPath, codeMelli);

    // شماره‌گذاری فایل‌ها بر اساس تعداد موجود
    const existingFiles = fs.readdirSync(userDir).filter(f => f.endsWith(".pdf"));
    const testNumber = existingFiles.length + 1;

    const finalName = `${testNumber}.pdf`; // فقط اسم فایل
    cb(null, finalName);
  },
});

// اجازه آپلود چند فایل همزمان (تا 100 فایل)
export const upload = multer({ storage }).array("files", 100);

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

// جستجوی فایل‌ها بر اساس کد ملی
const findFilesRecursively = (dir: string, codeMelli: string): string[] => {
  let results: string[] = [];
  const list = fs.readdirSync(dir, { withFileTypes: true });

  list.forEach(item => {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) results = results.concat(findFilesRecursively(fullPath, codeMelli));
    else if (item.isFile() && fullPath.includes(path.sep + codeMelli + path.sep) && fullPath.endsWith(".pdf"))
      results.push(fullPath);
  });

  return results;
};

// دریافت فایل‌ها بر اساس کد ملی
export const getFilesByCodeMelli = (req: Request, res: Response) => {
  const codeMelli = req.body?.codeMelli?.trim();
  if (!codeMelli) return res.status(400).json({ error: "کد ملی ارسال نشده است." });

  const matchedFiles = findFilesRecursively(UPLOAD_DIR, codeMelli);
  if (matchedFiles.length === 0)
    return res.status(404).json({ message: "فایلی برای این کد ملی پیدا نشد." });

  const filesData = matchedFiles.map(filePath => ({
    name: path.basename(filePath),
    data: fs.readFileSync(filePath).toString("base64"),
    path: path.relative(UPLOAD_DIR, filePath),
  }));

  res.json({ files: filesData });
};
