"use strict";
// ___________________________ pmt king coding ___________________ //
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAppointment = exports.reserveAppointment = void 0;
const Appointment_1 = __importDefault(require("../models/Appointment"));
const DoctorProfile_1 = __importDefault(require("../models/DoctorProfile"));
const reserveAppointment = async (data) => {
    try {
        const { fullName, phoneNumber, insuranceType, nationalCode, doctorId, appointmentDate, appointmentTime, } = data;
        // بررسی وجود پزشک
        const doctor = await DoctorProfile_1.default.findOne({ personnel: doctorId });
        if (!doctor) {
            throw new Error("پزشک یافت نشد");
        }
        // بررسی تداخل نوبت
        const conflict = await Appointment_1.default.findOne({
            doctorId,
            appointmentDate,
            appointmentTime,
            status: "reserved",
        });
        if (conflict) {
            throw new Error("این نوبت قبلاً رزرو شده است");
        }
        // ایجاد نوبت جدید
        const appointment = new Appointment_1.default({
            fullName,
            phoneNumber,
            insuranceType,
            nationalCode,
            doctorId,
            appointmentDate,
            appointmentTime,
            status: "reserved",
        });
        await appointment.save();
        return { success: true, message: "رزرو با موفقیت انجام شد" };
    }
    catch (error) {
        return { success: false, message: error.message };
    }
};
exports.reserveAppointment = reserveAppointment;
const findAppointment = async (nationalCode) => {
    try {
        // اعتبارسنجی اولیه
        if (!nationalCode || nationalCode.length !== 10) {
            return {
                success: false,
                message: "کد ملی باید 10 رقم باشد ❌",
                data: null,
            };
        }
        // جستجوی نوبت در دیتابیس
        const appointment = await Appointment_1.default.findOne({ nationalCode });
        if (!appointment) {
            return {
                success: false,
                message: "هیچ نوبتی برای این کد ملی ثبت نشده است ❌",
                data: null,
            };
        }
        return {
            success: true,
            message: "نوبت یافت شد ✅",
            data: appointment,
        };
    }
    catch (error) {
        console.error("❌ خطا در استعلام نوبت:", error.message);
        return {
            success: false,
            message: "خطا در پردازش درخواست",
            error: error.message,
            data: null,
        };
    }
};
exports.findAppointment = findAppointment;
