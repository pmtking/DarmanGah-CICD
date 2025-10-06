import { Request, Response, NextFunction } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { toJalaali } from "jalaali-js";

// مسیر اصلی ذخیره فایل‌ها
const UPLOAD_DIR = "/home/ubuntu-website/darmanBot/files/";

if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// گرفتن مسیر امروز به شمسی
const getTodayPath = () => {
  const now = new Date();
  const { jy, jm, jd } = toJalaali(now.getFullYear(), now.getMonth() + 1, now.getDate());
  return path.join(UPLOAD_DIR, `${jy}-${jm}-${jd}`);
};

// تنظیمات multer
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const todayPath = getTodayPath();
    if (!fs.existsSync(todayPath)) fs.mkdirSync(todayPath, { recursive: true });
    cb(null, todayPath);
  },
  filename: (req, file, cb) => {
    // استخراج کد ملی از نام فایل PDF
    const codeMelli = path.parse(file.originalname).name.trim();
    if (!codeMelli) return cb(new Error("کد ملی از نام فایل استخراج نشد."));

    // مسیر کد ملی
    const todayPath = getTodayPath();
    const userDir = path.join(todayPath, codeMelli);
    if (!fs.existsSync(userDir)) fs.mkdirSync(userDir, { recursive: true });

    // شماره گذاری آزمایش‌ها بر اساس فایل‌های موجود
    const existingFiles = fs.readdirSync(userDir).filter(f => f.endsWith(".pdf"));
    const testNumber = existingFiles.length + 1;

    const finalName = `${testNumber}.pdf`;
    cb(null, path.join(codeMelli, finalName)); // مسیر نهایی: {تاریخ}/{کدملی}/{شماره}.pdf
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
  else if (err)
    return res
      .status(400)
      .json({ error: err.message || "خطای سرور در آپلود فایل" });
  next();
};

// کنترلر آپلود چند فایل
export const uploadFiles = (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[];
  if (!files || files.length === 0)
    return res.status(400).json({ error: "هیچ فایلی ارسال نشده است." });

  const uploadedFiles = files.map((f) => ({
    name: path.basename(f.path),
    path: path.relative(UPLOAD_DIR, f.path),
  }));

  res.json({
    message: `✅ ${files.length} فایل با موفقیت آپلود شد.`,
    files: uploadedFiles,
  });
};

// جستجوی فایل‌ها
const findFilesRecursively = (dir: string, codeMelli: string): string[] => {
  let results: string[] = [];
  const list = fs.readdirSync(dir, { withFileTypes: true });

  list.forEach((item) => {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory())
      results = results.concat(findFilesRecursively(fullPath, codeMelli));
    else if (item.isFile() && path.basename(item.name).endsWith(".pdf") && fullPath.includes(codeMelli))
      results.push(fullPath);
  });

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

  const filesData = matchedFiles.map((filePath) => ({
    name: path.basename(filePath),
    data: fs.readFileSync(filePath).toString("base64"),
    path: path.relative(UPLOAD_DIR, filePath),
  }));

  res.json({ files: filesData });
};
