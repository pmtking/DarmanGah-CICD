import express from "express";
import { getFilesByCodeMelli, upload, uploadFiles } from "../controllers/LabController";


export const router = express.Router();

// مسیر آپلود چند فایل
router.post("/upload", upload.array("files"), uploadFiles);
router.post("/get-files", getFilesByCodeMelli);

export default router
