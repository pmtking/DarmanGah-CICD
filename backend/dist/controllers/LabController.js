"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilesByCodeMelli = exports.uploadFiles = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// مسیر ذخیره فایل‌ها
const UPLOAD_DIR = "/home/ubuntu-website/darmanBot/files/";
// اطمینان از وجود پوشه
if (!fs_1.default.existsSync(UPLOAD_DIR)) {
    fs_1.default.mkdirSync(UPLOAD_DIR, { recursive: true });
}
// تنظیمات multer
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, UPLOAD_DIR);
    },
    filename: (_req, file, cb) => {
        const uniqueName = `${file.originalname}`;
        cb(null, uniqueName);
    },
});
exports.upload = (0, multer_1.default)({ storage });
// کنترلر برای دریافت فایل‌ها
const uploadFiles = (req, res) => {
    const files = req.files;
    if (!files || files.length === 0) {
        return res.status(400).json({ error: "هیچ فایلی ارسال نشده است." });
    }
    const uploadedFiles = files.map((file) => file.filename);
    res.json({
        message: "✅ فایل‌ها با موفقیت آپلود شدند.",
        files: uploadedFiles,
    });
};
exports.uploadFiles = uploadFiles;
const getFilesByCodeMelli = (req, res) => {
    const { codeMelli } = req.body;
    if (!codeMelli) {
        return res.status(400).json({ error: "کد ملی ارسال نشده است." });
    }
    // خواندن فایل‌ها
    const allFiles = fs_1.default.readdirSync(UPLOAD_DIR);
    const matchedFiles = allFiles.filter((f) => f.startsWith(codeMelli));
    if (matchedFiles.length === 0) {
        return res.status(404).json({ message: "فایلی برای این کد ملی پیدا نشد." });
    }
    // می‌توانیم فایل‌ها را به صورت base64 یا لینک ارسال کنیم
    const filesData = matchedFiles.map((filename) => {
        const filePath = path_1.default.join(UPLOAD_DIR, filename);
        const fileBuffer = fs_1.default.readFileSync(filePath);
        return {
            name: filename,
            data: fileBuffer.toString("base64"), // encode برای ارسال در JSON
        };
    });
    res.json({ files: filesData });
};
exports.getFilesByCodeMelli = getFilesByCodeMelli;
