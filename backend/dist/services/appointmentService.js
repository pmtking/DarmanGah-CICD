"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAppointment = exports.cancelAppointment = exports.reserveAppointment = void 0;
// appointmentService.ts
const Appointment_1 = __importDefault(require("../models/Appointment"));
const DoctorProfile_1 = __importDefault(require("../models/DoctorProfile"));
const sendSms_1 = require("../utils/sendSms");
// ---------------- رزرو نوبت ----------------
const reserveAppointment = async (data) => {
    try {
        const { fullName, phoneNumber, insuranceType, nationalCode, doctorId, appointmentDate, appointmentTime, forceSMS = false, } = data;
        if (!fullName ||
            !phoneNumber ||
            !insuranceType ||
            !nationalCode ||
            !doctorId ||
            !appointmentDate ||
            !appointmentTime) {
            throw new Error("همه فیلدهای اجباری باید پر شوند ❌");
        }
        const doctor = await DoctorProfile_1.default.findOne({ personnel: doctorId });
        if (!doctor)
            throw new Error("پزشک یافت نشد ❌");
        const dateObj = appointmentDate instanceof Date
            ? appointmentDate
            : new Date(appointmentDate);
        const conflict = await Appointment_1.default.findOne({
            doctorId,
            appointmentDate: dateObj,
            appointmentTime,
            status: "reserved",
        });
        if (conflict && !forceSMS) {
            throw new Error("این نوبت قبلاً رزرو شده است ❌");
        }
        const appointment = new Appointment_1.default({
            fullName,
            phoneNumber,
            insuranceType,
            nationalCode,
            doctorId,
            appointmentDate: dateObj,
            appointmentTime,
            status: "reserved",
        });
        await appointment.save();
        // ارسال پیامک رزرو با روز هفته + زمان
        await (0, sendSms_1.sendReserveSMS)({
            phoneNumber,
            appointmentDate: dateObj,
            appointmentTime,
        });
        return {
            success: true,
            message: "رزرو با موفقیت انجام شد ✅",
            appointment,
        };
    }
    catch (error) {
        console.error("❌ Error in reserveAppointment:", error.message);
        return { success: false, message: error.message };
    }
};
exports.reserveAppointment = reserveAppointment;
// ---------------- لغو نوبت ----------------
const cancelAppointment = async (appointmentId) => {
    try {
        const appointment = await Appointment_1.default.findById(appointmentId);
        if (!appointment)
            throw new Error("نوبت موردنظر یافت نشد ❌");
        if (appointment.status === "cancelled")
            throw new Error("این نوبت قبلاً لغو شده ⚠️");
        appointment.status = "cancelled";
        await appointment.save();
        // ارسال پیامک لغو فقط با تاریخ YYYY/MM/DD
        await (0, sendSms_1.sendCancelSMS)({
            phoneNumber: appointment.phoneNumber,
            appointmentDate: appointment.appointmentDate,
        });
        return {
            success: true,
            message: "نوبت با موفقیت لغو شد ✅",
            canceled: appointment,
        };
    }
    catch (error) {
        console.error("❌ Error in cancelAppointment:", error.message);
        return { success: false, message: error.message };
    }
};
exports.cancelAppointment = cancelAppointment;
// ---------------- استعلام نوبت بر اساس کد ملی ----------------
const findAppointment = async (nationalCode) => {
    try {
        if (!nationalCode || nationalCode.length !== 10) {
            return {
                success: false,
                message: "کد ملی باید 10 رقم باشد ❌",
                data: null,
            };
        }
        const appointments = await Appointment_1.default.find({ nationalCode })
            .populate("doctorId", "name specialty")
            .sort({ appointmentDate: 1, appointmentTime: 1 });
        if (!appointments || appointments.length === 0) {
            return {
                success: false,
                message: "هیچ نوبتی برای این کد ملی ثبت نشده است ❌",
                data: null,
            };
        }
        return {
            success: true,
            message: "نوبت(ها) یافت شد ✅",
            data: appointments,
        };
    }
    catch (error) {
        console.error("❌ Error in findAppointment:", error.message);
        return {
            success: false,
            message: "خطا در پردازش درخواست ❌",
            error: error.message,
            data: null,
        };
    }
};
exports.findAppointment = findAppointment;
