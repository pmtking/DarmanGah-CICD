import { Request, Response, NextFunction } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

// مسیر ذخیره فایل‌ها
const UPLOAD_DIR = "/home/ubuntu-website/darmanBot/files/";

// اطمینان از وجود پوشه
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// تنظیمات multer برای آپلود تکی فایل
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext);
    const uniqueName = `${basename}-${timestamp}${ext}`;
    cb(null, uniqueName);
  },
});

// فقط یک فایل با کلید 'file' آپلود می‌کنیم
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
    return res.status(500).json({ error: "خطای سرور در آپلود فایل" });
  }
  next();
};

// کنترلر برای دریافت فایل
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

// گرفتن فایل‌ها بر اساس کد ملی
export const getFilesByCodeMelli = (req: Request, res: Response) => {
  const { codeMelli } = req.body;

  if (!codeMelli) {
    return res.status(400).json({ error: "کد ملی ارسال نشده است." });
  }

  const allFiles = fs.readdirSync(UPLOAD_DIR);
  const matchedFiles = allFiles.filter((f) => f.startsWith(codeMelli));

  if (matchedFiles.length === 0) {
    return res.status(404).json({ message: "فایلی برای این کد ملی پیدا نشد." });
  }

  const filesData = matchedFiles.map((filename) => {
    const filePath = path.join(UPLOAD_DIR, filename);
    const fileBuffer = fs.readFileSync(filePath);
    return {
      name: filename,
      data: fileBuffer.toString("base64"),
    };
  });

  res.json({ files: filesData });
};
