import { Router } from "express";
import { addInsurance, createClinicService, deleteClinicService, getAllClinicServices, getClinicServiceById, updateClinicService, updateInsurance } from "../controllers/clinicServiceController";

const router = Router();

// مسیرهای مربوط به سرویس‌های کلینیک
router.post("/add", createClinicService); // افزودن سرویس جدید
router.get("/", getAllClinicServices); // دریافت همه سرویس‌ها
router.get("/:id", getClinicServiceById); // دریافت سرویس خاص
router.put("/:id", updateClinicService); // ویرایش سرویس
router.delete("/:id", deleteClinicService); // حذف سرویس

// مسیرهای مربوط به بیمه تکمیلی
router.post("/:serviceId/insurance", addInsurance); // افزودن بیمه تکمیلی
router.put("/:serviceId/insurance/:companyName", updateInsurance); // آپدیت قیمت بیمه

export default router;
