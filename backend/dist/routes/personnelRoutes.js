"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// routes/personnelRoutes.ts
const express_1 = require("express");
const personnelController_1 = require("../controllers/personnelController");
const upload_1 = require("../middlewares/upload"); // ✅ middleware آپلود
const router = (0, express_1.Router)();
// ثبت پرسنل جدید + آپلود آواتار (photo یا avatar)
router.post("/add", upload_1.upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "avatar", maxCount: 1 },
]), personnelController_1.addPersonnelController);
// ورود پرسنل و دریافت توکن JWT
router.post("/login", personnelController_1.loginPersonnelController);
// گرفتن لیست پرسنل
router.get("/find", personnelController_1.findPersonnelController);
// ویرایش پرسنل + آپلود آواتار (photo یا avatar)
router.put("/:id", upload_1.upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "avatar", maxCount: 1 },
]), personnelController_1.updatePersonnelController);
// حذف پرسنل
router.delete("/:id", personnelController_1.deletePersonnelController);
exports.default = router;
