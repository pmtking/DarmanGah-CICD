"use strict";
// ---------------- pmt king coding (optimized + Personnel populate + SMS fix + Reception Delete) ---------------- //
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteAppointmentByReceptionController = exports.CancelByNationalCodeController = exports.GetAppointmentController = exports.FindAppointmentController = exports.ReserveAppointmentController = exports.GetAvailableTimesController = void 0;
const Appointment_1 = __importDefault(require("../models/Appointment"));
const sendSms_1 = require("../utils/sendSms");
// ----------------- دریافت زمان‌های آزاد برای یک پزشک -----------------
const GetAvailableTimesController = async (req, res) => {
    try {
        const { doctorId, appointmentDate } = req.body;
        if (!doctorId || !appointmentDate)
            return res.status(400).json({ success: false, message: "doctorId و appointmentDate الزامی هستند ❌" });
        const dateObj = new Date(appointmentDate);
        if (isNaN(dateObj.getTime()))
            return res.status(400).json({ success: false, message: "فرمت تاریخ معتبر نیست ❌" });
        const bookedAppointments = await Appointment_1.default.find({
            doctorId,
            appointmentDate: dateObj,
            status: { $ne: "cancelled" },
        }).select("appointmentTime");
        const bookedTimes = bookedAppointments.map(a => a.appointmentTime);
        return res.status(200).json({ success: true, bookedTimes });
    }
    catch (error) {
        console.error("❌ Error in GetAvailableTimesController:", error);
        return res.status(500).json({ success: false, message: "خطا در دریافت زمان‌های آزاد" });
    }
};
exports.GetAvailableTimesController = GetAvailableTimesController;
// ----------------- رزرو نوبت -----------------
const ReserveAppointmentController = async (req, res) => {
    try {
        const { fullName, phoneNumber, insuranceType, nationalCode, doctorId, appointmentDate, appointmentTime } = req.body;
        if (!fullName || !phoneNumber || !insuranceType || !nationalCode || !doctorId || !appointmentDate || !appointmentTime)
            return res.status(400).json({ success: false, message: "همه فیلدهای اجباری باید پر شوند ❌" });
        const dateObj = new Date(appointmentDate);
        if (isNaN(dateObj.getTime()))
            return res.status(400).json({ success: false, message: "فرمت تاریخ نوبت معتبر نیست ❌" });
        const exists = await Appointment_1.default.findOne({
            doctorId,
            appointmentDate: dateObj,
            appointmentTime,
            status: { $ne: "cancelled" },
        });
        if (exists)
            return res.status(409).json({ success: false, message: "این نوبت قبلاً رزرو شده است ❌" });
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
        const populated = await appointment.populate({
            path: "doctorId",
            model: "Personnel",
            select: "name specialty",
        });
        try {
            await (0, sendSms_1.sendReserveSMS)({ phoneNumber, appointmentDate: dateObj, appointmentTime });
        }
        catch (smsError) {
            console.error("❌ خطا در ارسال پیامک رزرو:", smsError);
        }
        return res.status(201).json({
            success: true,
            message: "✅ نوبت با موفقیت ثبت شد",
            data: {
                ...populated.toObject(),
                doctorName: populated.doctorId?.name || "نامشخص",
                doctorId: undefined,
            },
        });
    }
    catch (error) {
        console.error("❌ Error in ReserveAppointmentController:", error);
        return res.status(500).json({ success: false, message: error.message || "خطا در رزرو نوبت" });
    }
};
exports.ReserveAppointmentController = ReserveAppointmentController;
// ----------------- استعلام نوبت بر اساس کد ملی -----------------
const FindAppointmentController = async (req, res) => {
    try {
        const { nationalCode } = req.body;
        if (!nationalCode)
            return res.status(400).json({ success: false, message: "کد ملی الزامی است ❌" });
        const appointments = await Appointment_1.default.find({ nationalCode })
            .populate({ path: "doctorId", model: "Personnel", select: "name specialty" })
            .sort({ appointmentDate: 1, appointmentTime: 1 });
        if (!appointments.length)
            return res.status(404).json({ success: false, message: "هیچ نوبتی یافت نشد ❌" });
        const formatted = appointments.map(a => ({
            ...a.toObject(),
            doctorName: a.doctorId?.name || "نامشخص",
            doctorId: undefined,
        }));
        return res.status(200).json({ success: true, count: formatted.length, data: formatted });
    }
    catch (error) {
        console.error("❌ Error in FindAppointmentController:", error);
        return res.status(500).json({ success: false, message: "خطای داخلی سرور" });
    }
};
exports.FindAppointmentController = FindAppointmentController;
// ----------------- دریافت همه نوبت‌ها (برای پذیرش) -----------------
const GetAppointmentController = async (req, res) => {
    try {
        const appointments = await Appointment_1.default.find()
            .populate({ path: "doctorId", model: "Personnel", select: "name specialty" })
            .sort({ appointmentDate: 1, appointmentTime: 1 });
        const formatted = appointments.map(a => ({
            ...a.toObject(),
            doctorName: a.doctorId?.name || "نامشخص",
            doctorId: undefined,
        }));
        return res.status(200).json({ success: true, count: formatted.length, data: formatted });
    }
    catch (error) {
        console.error("❌ Error fetching appointments:", error);
        return res.status(500).json({ success: false, message: "خطا در دریافت نوبت‌ها" });
    }
};
exports.GetAppointmentController = GetAppointmentController;
// ----------------- لغو نوبت توسط بیمار (با کد ملی) -----------------
const CancelByNationalCodeController = async (req, res) => {
    try {
        const { nationalCode, appointmentId } = req.body;
        if (!nationalCode)
            return res.status(400).json({ success: false, message: "کد ملی الزامی است ❌" });
        const appointments = await Appointment_1.default.find({ nationalCode })
            .populate({ path: "doctorId", model: "Personnel", select: "name specialty" })
            .sort({ appointmentDate: 1, appointmentTime: 1 });
        if (!appointments.length)
            return res.status(404).json({ success: false, message: "هیچ نوبتی یافت نشد ❌" });
        if (appointmentId) {
            const appointment = await Appointment_1.default.findOne({ _id: appointmentId, nationalCode })
                .populate({ path: "doctorId", model: "Personnel", select: "name" });
            if (!appointment)
                return res.status(404).json({ success: false, message: "نوبت موردنظر یافت نشد ❌" });
            if (appointment.status === "cancelled")
                return res.status(400).json({ success: false, message: "این نوبت قبلاً لغو شده ⚠️" });
            appointment.status = "cancelled";
            await appointment.save();
            try {
                await (0, sendSms_1.sendCancelSMS)({ phoneNumber: appointment.phoneNumber, appointmentDate: appointment.appointmentDate });
            }
            catch (smsError) {
                console.error("❌ خطا در ارسال پیامک لغو:", smsError);
            }
            return res.status(200).json({
                success: true,
                message: "✅ نوبت لغو شد و پیامک ارسال گردید",
                canceled: {
                    ...appointment.toObject(),
                    doctorName: appointment.doctorId?.name || "نامشخص",
                    doctorId: undefined,
                },
            });
        }
        const formattedAppointments = appointments.map(a => ({
            ...a.toObject(),
            doctorName: a.doctorId?.name || "نامشخص",
            doctorId: undefined,
        }));
        return res.status(200).json({
            success: true,
            count: formattedAppointments.length,
            appointments: formattedAppointments,
        });
    }
    catch (error) {
        console.error("❌ Error in CancelByNationalCodeController:", error);
        return res.status(500).json({ success: false, message: "خطای داخلی سرور" });
    }
};
exports.CancelByNationalCodeController = CancelByNationalCodeController;
// ----------------- حذف نوبت‌ها توسط پذیرش (تکی، چندتایی یا همه) -----------------
const DeleteAppointmentByReceptionController = async (req, res) => {
    try {
        const { appointmentId, appointmentIds, deleteAll } = req.body;
        // حذف همه نوبت‌ها
        if (deleteAll) {
            const result = await Appointment_1.default.deleteMany({});
            return res.status(200).json({
                success: true,
                message: `✅ تمام ${result.deletedCount} نوبت با موفقیت حذف شدند.`,
            });
        }
        // حذف چندتایی
        if (Array.isArray(appointmentIds) && appointmentIds.length > 0) {
            const result = await Appointment_1.default.deleteMany({ _id: { $in: appointmentIds } });
            return res.status(200).json({
                success: true,
                message: `✅ ${result.deletedCount} نوبت انتخابی حذف شدند.`,
            });
        }
        // حذف تکی
        if (appointmentId) {
            const deleted = await Appointment_1.default.findByIdAndDelete(appointmentId);
            if (!deleted)
                return res.status(404).json({ success: false, message: "نوبت موردنظر یافت نشد ❌" });
            return res.status(200).json({
                success: true,
                message: "✅ نوبت با موفقیت حذف شد.",
            });
        }
        return res.status(400).json({ success: false, message: "هیچ شناسه نوبتی ارسال نشده ❌" });
    }
    catch (error) {
        console.error("❌ Error in DeleteAppointmentByReceptionController:", error);
        return res.status(500).json({ success: false, message: "خطا در حذف نوبت‌ها" });
    }
};
exports.DeleteAppointmentByReceptionController = DeleteAppointmentByReceptionController;
