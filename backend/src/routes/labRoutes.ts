import express from "express";
import {
  getFilesByCodeMelli,
  upload,
  uploadFiles,
  handleMulterError,
  serveFile, // اضافه شد
} from "../controllers/LabController";

export const router = express.Router();

// ------------------- آپلود فایل‌ها ------------------- //
router.post("/upload", upload, handleMulterError, uploadFiles);

// ------------------- گرفتن فایل‌ها بر اساس کد ملی ------------------- //
router.post("/get-files", getFilesByCodeMelli);

// ------------------- نمایش یا دانلود فایل ------------------- //
// query: ?path=relative/path/to/file.pdf&mode=inline|download
router.get("/file", serveFile);

export default router;
