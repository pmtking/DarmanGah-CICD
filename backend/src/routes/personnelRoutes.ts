// routes/personnelRoutes.ts
import { Router } from "express";
import {
  addPersonnelController,
  loginPersonnelController,
  findPersonel,
  updatePersonnelController,
  deletePersonnelController,
} from "../controllers/personnelController";

const router = Router();

// ثبت پرسنل جدید
router.post("/", addPersonnelController);

// ورود پرسنل و دریافت توکن JWT
router.post("/login", loginPersonnelController);

// گرفتن لیست پرسنل
router.get("/find", findPersonel);

// ویرایش پرسنل
router.put("/:id", updatePersonnelController);

// حذف پرسنل
router.delete("/:id", deletePersonnelController);

export default router;
