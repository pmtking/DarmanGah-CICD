"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serveFile = exports.getFilesByCodeMelli = exports.uploadFiles = exports.handleMulterError = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const jalaali_js_1 = require("jalaali-js");
// مسیر اصلی ذخیره فایل‌ها
const UPLOAD_DIR = "/home/ubuntu-website/lab";
if (!fs_1.default.existsSync(UPLOAD_DIR))
    fs_1.default.mkdirSync(UPLOAD_DIR, { recursive: true });
// گرفتن مسیر امروز به شمسی
const getTodayPath = () => {
    const now = new Date();
    const { jy, jm, jd } = (0, jalaali_js_1.toJalaali)(now.getFullYear(), now.getMonth() + 1, now.getDate());
    const todayPath = path_1.default.join(UPLOAD_DIR, `${jd}-${jm}-${jy}`);
    if (!fs_1.default.existsSync(todayPath))
        fs_1.default.mkdirSync(todayPath, { recursive: true });
    return todayPath;
};
// تنظیمات Multer
const storage = multer_1.default.diskStorage({
    destination: (_req, file, cb) => {
        const todayPath = getTodayPath();
        const codeMelli = path_1.default.parse(file.originalname).name.trim();
        if (!codeMelli)
            return cb(new Error("کد ملی از نام فایل استخراج نشد."));
        const userDir = path_1.default.join(todayPath, codeMelli);
        if (!fs_1.default.existsSync(userDir))
            fs_1.default.mkdirSync(userDir, { recursive: true });
        cb(null, userDir);
    },
    filename: (_req, file, cb) => {
        const codeMelli = path_1.default.parse(file.originalname).name.trim();
        const userDir = path_1.default.join(getTodayPath(), codeMelli);
        const existingFiles = fs_1.default.existsSync(userDir)
            ? fs_1.default.readdirSync(userDir).filter(f => f.endsWith(".pdf"))
            : [];
        cb(null, `${existingFiles.length + 1}.pdf`);
    },
});
exports.upload = (0, multer_1.default)({ storage, limits: { fileSize: 50 * 1024 * 1024 } }).array("files", 100);
// مدیریت خطاهای Multer
const handleMulterError = (err, _req, res, next) => {
    if (err instanceof multer_1.default.MulterError)
        return res.status(400).json({ error: err.message });
    if (err)
        return res.status(400).json({ error: err.message || "خطای سرور در آپلود فایل" });
    next();
};
exports.handleMulterError = handleMulterError;
// آپلود فایل‌ها
const uploadFiles = (req, res) => {
    const files = req.files;
    if (!files || files.length === 0)
        return res.status(400).json({ error: "هیچ فایلی ارسال نشده است." });
    const uploadedFiles = files.map(f => {
        const relativePath = path_1.default.relative(UPLOAD_DIR, f.path).replace(/\\/g, "/");
        return {
            name: path_1.default.basename(f.path),
            path: relativePath,
            urlPreview: `/api/lab/file?path=${encodeURIComponent(relativePath)}&mode=inline`,
            urlDownload: `/api/lab/file?path=${encodeURIComponent(relativePath)}&mode=download`,
        };
    });
    res.json({ message: `✅ ${files.length} فایل با موفقیت آپلود شد.`, files: uploadedFiles });
};
exports.uploadFiles = uploadFiles;
// جستجوی فایل‌ها به صورت بازگشتی
const findFilesRecursively = (dir, codeMelli) => {
    if (!fs_1.default.existsSync(dir))
        return [];
    let results = [];
    const list = fs_1.default.readdirSync(dir, { withFileTypes: true });
    for (const item of list) {
        const fullPath = path_1.default.join(dir, item.name);
        if (item.isDirectory()) {
            results = results.concat(findFilesRecursively(fullPath, codeMelli));
        }
        else if (item.isFile() && fullPath.endsWith(".pdf") && fullPath.split(path_1.default.sep).includes(codeMelli)) {
            results.push(fullPath);
        }
    }
    return results;
};
// گرفتن فایل‌ها بر اساس کد ملی
const getFilesByCodeMelli = (req, res) => {
    const codeMelli = req.body?.codeMelli?.trim();
    if (!codeMelli)
        return res.status(400).json({ error: "کد ملی ارسال نشده است." });
    const matchedFiles = findFilesRecursively(UPLOAD_DIR, codeMelli);
    if (matchedFiles.length === 0)
        return res.status(404).json({ message: "فایلی برای این کد ملی پیدا نشد." });
    const filesData = matchedFiles.map(filePath => {
        const relativePath = path_1.default.relative(UPLOAD_DIR, filePath).replace(/\\/g, "/");
        const parts = relativePath.split("/");
        const dateFolder = parts.length > 1 ? parts[0] : "نامشخص";
        return {
            name: path_1.default.basename(filePath),
            path: relativePath,
            dateFolder,
            urlPreview: `/api/lab/file?path=${encodeURIComponent(relativePath)}&mode=inline`,
            urlDownload: `/api/lab/file?path=${encodeURIComponent(relativePath)}&mode=download`,
        };
    });
    res.json({ files: filesData });
};
exports.getFilesByCodeMelli = getFilesByCodeMelli;
// سرو کردن فایل‌ها برای دانلود یا پیش‌نمایش
const serveFile = (req, res) => {
    const filePath = req.query.path;
    const mode = req.query.mode === "inline" ? "inline" : "attachment"; // پیش‌فرض attachment
    if (!filePath)
        return res.status(400).json({ error: "مسیر فایل ارسال نشده است." });
    const decodedPath = decodeURIComponent(filePath);
    const fullPath = path_1.default.join(UPLOAD_DIR, decodedPath);
    if (!fs_1.default.existsSync(fullPath))
        return res.status(404).json({ error: "فایل پیدا نشد." });
    const fileName = path_1.default.basename(fullPath);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `${mode}; filename="${fileName}"`);
    fs_1.default.createReadStream(fullPath).pipe(res);
};
exports.serveFile = serveFile;
