import { Request, Response, NextFunction } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

// مسیر اصلی ذخیره فایل‌ها
const UPLOAD_DIR = "/home/ubuntu-website/darmanBot/files/";

// اطمینان از وجود پوشه اصلی
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// گرفتن تاریخ امروز به فرمت YYYY/MM/DD
const getTodayPath = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return path.join(UPLOAD_DIR, year.toString(), month, day);
};

// تنظیمات multer برای آپلود تکی فایل
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const todayPath = getTodayPath();
    if (!fs.existsSync(todayPath)) fs.mkdirSync(todayPath, { recursive: true });
    cb(null, todayPath);
  },
  filename: (req, _file, cb) => {
    const codeMelli = req.body.codeMelli;
    if (!codeMelli) return cb(new Error("کد ملی ارسال نشده است."));

    const finalName = `${codeMelli}.file`;
    const todayPath = getTodayPath();
    const filePath = path.join(todayPath, finalName);

    // بررسی وجود فایل با همان کد ملی در پوشه امروز
    if (fs.existsSync(filePath)) {
      return cb(new Error("فایل با این کد ملی امروز قبلا آپلود شده است."));
    }

    cb(null, finalName);
  },
});

export const upload = multer({ storage }).single("file");

// middleware برای مدیریت خطای multer
export const handleMulterError = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.message });
  } else if (err) {
    return res.status(400).json({ error: err.message || "خطای سرور در آپلود فایل" });
  }
  next();
};

// کنترلر آپلود فایل
export const uploadFiles = (req: Request, res: Response) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ error: "هیچ فایلی ارسال نشده است." });
  }
  res.json({
    message: "✅ فایل با موفقیت آپلود شد.",
    file: file.filename,
  });
};

// تابع کمکی برای جستجوی فایل‌ها در تمام زیرپوشه‌ها
const findFilesRecursively = (dir: string, codeMelli: string): string[] => {
  let results: string[] = [];
  const list = fs.readdirSync(dir, { withFileTypes: true });

  list.forEach((item) => {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      results = results.concat(findFilesRecursively(fullPath, codeMelli));
    } else if (item.isFile() && item.name.startsWith(codeMelli)) {
      results.push(fullPath);
    }
  });

  return results;
};

// گرفتن فایل‌ها بر اساس کد ملی
export const getFilesByCodeMelli = (req: Request, res: Response) => {
  const { codeMelli } = req.body;

  if (!codeMelli) {
    return res.status(400).json({ error: "کد ملی ارسال نشده است." });
  }

  const matchedFiles = findFilesRecursively(UPLOAD_DIR, codeMelli);

  if (matchedFiles.length === 0) {
    return res.status(404).json({ message: "فایلی برای این کد ملی پیدا نشد." });
  }

  const filesData = matchedFiles.map((filePath) => {
    const fileBuffer = fs.readFileSync(filePath);
    return {
      name: path.basename(filePath),
      data: fileBuffer.toString("base64"),
      path: path.relative(UPLOAD_DIR, filePath), // مسیر نسبی برای راحتی
    };
  });

  res.json({ files: filesData });
};
