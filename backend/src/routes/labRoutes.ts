import express from "express";
import { getFilesByCodeMelli, upload, uploadFiles, handleMulterError } from "../controllers/LabController";

export const router = express.Router();

// آپلود تکی فایل
router.post("/upload", upload, handleMulterError, uploadFiles);

// گرفتن فایل‌ها بر اساس کد ملی
router.post("/get-files", getFilesByCodeMelli);

export default router;
