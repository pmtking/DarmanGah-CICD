"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const LabController_1 = require("../controllers/LabController");
const router = express_1.default.Router();
// ----------------------------
// آپلود فایل‌ها (چند فایل همزمان)
// ----------------------------
router.post("/upload", LabController_1.upload, LabController_1.handleMulterError, LabController_1.uploadFiles);
// ----------------------------
// گرفتن فایل‌ها بر اساس کد ملی
// ----------------------------
router.post("/get-files", LabController_1.getFilesByCodeMelli);
// ----------------------------
// دانلود یا پیش‌نمایش فایل
// mode=inline -> پیش‌نمایش
// mode=download -> دانلود
// ----------------------------
router.get("/file", LabController_1.serveFile);
exports.default = router;
