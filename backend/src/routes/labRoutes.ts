import express from "express";
import { getFilesByCodeMelli, upload, uploadFiles, handleMulterError, serveFile } from "../controllers/LabController";

const router = express.Router();

// ----------------------------
// آپلود فایل‌ها (چند فایل همزمان)
// ----------------------------
router.post("/upload", upload, handleMulterError, uploadFiles);

// ----------------------------
// گرفتن فایل‌ها بر اساس کد ملی
// ----------------------------
router.post("/get-files", getFilesByCodeMelli);

// ----------------------------
// دانلود یا پیش‌نمایش فایل
// mode=inline -> پیش‌نمایش
// mode=download -> دانلود
// ----------------------------
router.get("/file", serveFile);

export default router;
