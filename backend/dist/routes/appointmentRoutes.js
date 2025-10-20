"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const appointmentController_1 = require("../controllers/appointmentController");
const router = express_1.default.Router();
// ------------------ مسیرهای نوبت‌دهی ------------------ //
// رزرو نوبت جدید
router.post("/add", appointmentController_1.ReserveAppointmentController);
// دریافت زمان‌های آزاد برای یک پزشک
router.post("/available", appointmentController_1.GetAvailableTimesController);
// استعلام نوبت‌ها بر اساس کد ملی
router.post("/find", appointmentController_1.FindAppointmentController);
// دریافت تمام نوبت‌ها (برای بخش پذیرش)
router.get("/", appointmentController_1.GetAppointmentController);
// لغو نوبت با کد ملی
router.post("/cancel-by-code", appointmentController_1.CancelByNationalCodeController);
// حذف نوبت‌ها توسط پذیرش (تکی، چندتایی یا همه)
router.post("/delete-by-reception", appointmentController_1.DeleteAppointmentByReceptionController);
// ------------------------------------------------------- //
exports.default = router;
