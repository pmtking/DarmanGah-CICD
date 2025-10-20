import express from "express";
import {
  CancelByNationalCodeController,
  FindAppointmentController,
  GetAppointmentController,
  GetAvailableTimesController,
  ReserveAppointmentController,
  DeleteAppointmentByReceptionController, // 🆕 حذف نوبت توسط پذیرش
} from "../controllers/appointmentController";

const router = express.Router();

// ------------------ مسیرهای نوبت‌دهی ------------------ //

// رزرو نوبت جدید
router.post("/add", ReserveAppointmentController);

// دریافت زمان‌های آزاد برای یک پزشک
router.post("/available", GetAvailableTimesController);

// استعلام نوبت‌ها بر اساس کد ملی
router.post("/find", FindAppointmentController);

// دریافت تمام نوبت‌ها (برای بخش پذیرش)
router.get("/", GetAppointmentController);

// لغو نوبت با کد ملی
router.post("/cancel-by-code", CancelByNationalCodeController);

// حذف نوبت‌ها توسط پذیرش (تکی، چندتایی یا همه)
router.post("/delete-by-reception", DeleteAppointmentByReceptionController);

// ------------------------------------------------------- //

export default router;
