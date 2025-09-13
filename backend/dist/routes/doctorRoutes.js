"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const doctorProfileController_1 = require("../controllers/doctorProfileController");
const router = express_1.default.Router();
// ------------------ دریافت اطلاعات ---------------------------- //
router.get("/find", doctorProfileController_1.findDoctor);
// ---------------------- ایجاد پروفایل پزشک ---------------------- //
router.post("/add", doctorProfileController_1.createProfile);
// ---------------------- دریافت همه پروفایل‌ها ---------------------- //
router.get("/", doctorProfileController_1.getProfiles);
// ---------------------- دریافت پروفایل با آیدی ---------------------- //
router.get("/:id", doctorProfileController_1.getProfileById);
// ---------------------- بروزرسانی پروفایل پزشک ---------------------- //
router.put("/:id", doctorProfileController_1.updateProfile);
// ---------------------- حذف پروفایل پزشک ---------------------- //
router.delete("/:id", doctorProfileController_1.deleteProfile);
// ---------------------- تغییر وضعیت فعال بودن پزشک ---------------------- //
router.patch("/:id/availability", doctorProfileController_1.changeAvailability);
// ---------------------- افزودن مدرک جدید به پروفایل ---------------------- //
router.post("/:id/document", doctorProfileController_1.uploadDocument);
// --------------------------- ایجاد و بهروز رسانی ------------------------ //
router.post("/upsert", doctorProfileController_1.upsertProfile);
//  ------------------------------- دسته بندی پزشک -------------------- //
router.get("/all", doctorProfileController_1.getAllDoctorsController);
// --------------------- export =----------------- //
exports.default = router;
