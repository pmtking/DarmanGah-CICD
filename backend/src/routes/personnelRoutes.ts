// routes/personnelRoutes.ts
import { Router } from "express";
import {
  addPersonnelController,
  loginPersonnelController,

  updatePersonnelController,
  deletePersonnelController,
  findPersonnelController,
} from "../controllers/personnelController";

const router = Router();

// ثبت پرسنل جدید
router.post("/add", addPersonnelController);

// ورود پرسنل و دریافت توکن JWT
router.post("/login", loginPersonnelController);

// گرفتن لیست پرسنل
router.get("/find", findPersonnelController);

// ویرایش پرسنل
router.put("/:id", updatePersonnelController);

// حذف پرسنل
router.delete("/:id", deletePersonnelController);

export default router;
