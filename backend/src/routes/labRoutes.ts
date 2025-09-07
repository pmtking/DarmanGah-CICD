import express from "express";
import { upload, uploadFiles } from "../controllers/LabController";


export const router = express.Router();

// مسیر آپلود چند فایل
router.post("/upload", upload.array("files"), uploadFiles);

export default router
