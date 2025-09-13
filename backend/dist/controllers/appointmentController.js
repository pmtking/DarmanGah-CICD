"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAppointmentController = exports.FindAppointmentController = exports.ReserveAppointmentController = void 0;
const appointmentService_1 = require("../services/appointmentService");
const Appointment_1 = __importDefault(require("../models/Appointment"));
const jalaali_js_1 = __importDefault(require("jalaali-js"));
const ReserveAppointmentController = async (req, res) => {
    try {
        const appointment = await (0, appointmentService_1.reserveAppointment)(req.body);
        res.status(201).json({ message: "نوبت ثبت شد", appointment });
    }
    catch (error) {
        const msg = error.message || "خطا در نوبت ";
        const status = msg.includes("یافت  نشد")
            ? 404
            : msg.includes("قبلا رزرو شده ");
        res.status(400).json({ message: msg });
    }
};
exports.ReserveAppointmentController = ReserveAppointmentController;
const FindAppointmentController = async (req, res) => {
    try {
        const { nationalCode } = req.body;
        if (!nationalCode) {
            return res.status(400).json({ message: "کد ملی الزامی است ❌" });
        }
        const result = await (0, appointmentService_1.findAppointment)(nationalCode);
        if (!result.success) {
            return res.status(404).json(result);
        }
        return res.status(200).json(result);
    }
    catch (error) {
        console.error("❌ خطا در کنترلر استعلام نوبت:", error);
        return res.status(500).json({ message: "خطای داخلی سرور" });
    }
};
exports.FindAppointmentController = FindAppointmentController;
const GetAppointmentController = async (req, res) => {
    try {
        // دریافت تاریخ شمسی امروز
        const today = new Date();
        const { jy, jm, jd } = jalaali_js_1.default.toJalaali(today);
        // تبدیل به میلادی برای محدوده روز
        const { gy, gm, gd } = jalaali_js_1.default.toGregorian(jy, jm, jd);
        const startOfDay = new Date(gy, gm - 1, gd, 0, 0, 0, 0);
        const endOfDay = new Date(gy, gm - 1, gd, 23, 59, 59, 999);
        // دریافت نوبت‌های امروز فقط با وضعیت "reserved"
        const appointments = await Appointment_1.default.find({
            appointmentDate: { $gte: startOfDay, $lte: endOfDay },
            status: "reserved",
        })
            .populate("doctorId", "fullName specialization") // نمایش نام و تخصص پزشک
            .sort({ appointmentTime: 1 }); // مرتب‌سازی بر اساس ساعت نوبت
        return res.status(200).json({
            success: true,
            count: appointments.length,
            data: appointments,
        });
    }
    catch (error) {
        console.error("Error fetching today's appointments:", error);
        return res.status(500).json({
            success: false,
            message: "خطا در دریافت نوبت‌ها",
        });
    }
};
exports.GetAppointmentController = GetAppointmentController;
