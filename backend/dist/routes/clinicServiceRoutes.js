"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const clinicServiceController_1 = require("../controllers/clinicServiceController");
const router = (0, express_1.Router)();
// مسیرهای مربوط به سرویس‌های کلینیک
router.post("/add", clinicServiceController_1.createClinicService); // افزودن سرویس جدید
router.get("/", clinicServiceController_1.getAllClinicServices); // دریافت همه سرویس‌ها
router.get("/:id", clinicServiceController_1.getClinicServiceById); // دریافت سرویس خاص
router.put("/:id", clinicServiceController_1.updateClinicService); // ویرایش سرویس
router.delete("/:id", clinicServiceController_1.deleteClinicService); // حذف سرویس
// مسیرهای مربوط به بیمه تکمیلی
router.post("/:serviceId/insurance", clinicServiceController_1.addInsurance); // افزودن بیمه تکمیلی
router.put("/:serviceId/insurance/:companyName", clinicServiceController_1.updateInsurance); // آپدیت قیمت بیمه
exports.default = router;
