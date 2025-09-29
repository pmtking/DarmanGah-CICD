// routes/personnelRoutes.ts
import { Router } from "express";
import {
  addPersonnelController,
  loginPersonnelController,
  updatePersonnelController,
  deletePersonnelController,
  findPersonnelController,
} from "../controllers/personnelController";
import { upload } from "../middlewares/upload"; // ✅ middleware آپلود

const router = Router();

// ثبت پرسنل جدید + آپلود آواتار (photo یا avatar)
router.post(
  "/add",
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "avatar", maxCount: 1 },
  ]),
  addPersonnelController
);

// ورود پرسنل و دریافت توکن JWT
router.post("/login", loginPersonnelController);

// گرفتن لیست پرسنل
router.get("/find", findPersonnelController);

// ویرایش پرسنل + آپلود آواتار (photo یا avatar)
router.put(
  "/:id",
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "avatar", maxCount: 1 },
  ]),
  updatePersonnelController
);

// حذف پرسنل
router.delete("/:id", deletePersonnelController);

export default router;
