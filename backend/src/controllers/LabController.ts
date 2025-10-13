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
    cb(null, `${existingFiles.length + 1}.pdf`);
  },
});

// Multer برای چند فایل همزمان
export const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } }).array("files", 100);

// مدیریت خطاهای multer
export const handleMulterError = (
  err: any,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof multer.MulterError) return res.status(400).json({ error: err.message });
  if (err) return res.status(400).json({ error: err.message || "خطای سرور در آپلود فایل" });
  next();
};

// کنترلر آپلود فایل‌ها
export const uploadFiles = (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[];
  if (!files || files.length === 0)
    return res.status(400).json({ error: "هیچ فایلی ارسال نشده است." });

  const uploadedFiles = files.map(f => ({
    name: path.basename(f.path),
    path: path.relative(UPLOAD_DIR, f.path).replace(/\\/g, "/"),
    url: `/api/lab/download?path=${encodeURIComponent(path.relative(UPLOAD_DIR, f.path).replace(/\\/g, "/"))}`,
  }));

  res.json({
    message: `✅ ${files.length} فایل با موفقیت آپلود شد.`,
    files: uploadedFiles,
  });
};

// جستجوی فایل‌ها به صورت بازگشتی بر اساس کد ملی
const findFilesRecursively = (dir: string, codeMelli: string): string[] => {
  if (!fs.existsSync(dir)) return [];
  let results: string[] = [];
  const list = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of list) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      results = results.concat(findFilesRecursively(fullPath, codeMelli));
    } else if (item.isFile() && fullPath.endsWith(".pdf") && fullPath.split(path.sep).includes(codeMelli)) {
      results.push(fullPath);
    }
  }
  return results;
};

// دریافت فایل‌ها بر اساس کد ملی
export const getFilesByCodeMelli = (req: Request, res: Response) => {
  const codeMelli = req.body?.codeMelli?.trim();
  if (!codeMelli) return res.status(400).json({ error: "کد ملی ارسال نشده است." });

  const matchedFiles = findFilesRecursively(UPLOAD_DIR, codeMelli);
  if (matchedFiles.length === 0) return res.status(404).json({ message: "فایلی برای این کد ملی پیدا نشد." });

  const filesData = matchedFiles.map(filePath => {
    const relativePath = path.relative(UPLOAD_DIR, filePath).replace(/\\/g, "/");
    const parts = relativePath.split("/");
    const dateFolder = parts.length > 1 ? parts[0] : "نامشخص";

    return {
      name: path.basename(filePath),
      path: relativePath,
      dateFolder,
      // لینک واحد برای دانلود و پیش‌نمایش
      urlPreview: `/api/lab/file?path=${encodeURIComponent(relativePath)}&mode=inline`,
      urlDownload: `/api/lab/file?path=${encodeURIComponent(relativePath)}&mode=download`,
    };
  });

  res.json({ files: filesData });
};


// دانلود فایل
export const downloadFile = (req: Request, res: Response) => {
  const filePath = req.query.path as string;
  const preview = req.query.preview === "1"; // برای پیش‌نمایش

  if (!filePath) return res.status(400).json({ error: "مسیر فایل ارسال نشده است." });

  const fullPath = path.join(UPLOAD_DIR, filePath);
  if (!fs.existsSync(fullPath)) return res.status(404).json({ error: "فایل پیدا نشد." });

  const fileName = path.basename(fullPath);
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    preview ? `inline; filename="${fileName}"` : `attachment; filename="${fileName}"`
  );

  const stream = fs.createReadStream(fullPath);
  stream.pipe(res);
};
