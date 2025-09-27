// _______________ pmt king coding _______________________ //
// imports
import { Response, Request } from "express";
import {
  findAppointment,
  reserveAppointment,
} from "../services/appointmentService";
import Appointment from "../models/Appointment";


// ----------------- رزرو نوبت -----------------
export const ReserveAppointmentController = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      fullName,
      phoneNumber,
      insuranceType,
      nationalCode,
      doctorId,
      appointmentDate,
      appointmentTime,
    } = req.body;

    // ولیدیشن اولیه
    if (
      !fullName ||
      !phoneNumber ||
      !insuranceType ||
      !nationalCode ||
      !doctorId ||
      !appointmentDate ||
      !appointmentTime
    ) {
      return res
        .status(400)
        .json({ message: "همه فیلدهای اجباری باید پر شوند ❌" });
    }

    const appointment = await reserveAppointment(req.body);
    return res.status(201).json({ message: "✅ نوبت ثبت شد", appointment });
  } catch (error: any) {
    console.error("❌ Error in ReserveAppointmentController:", error);

    const msg = error.message || "خطا در نوبت‌دهی";
    let status = 500;

    if (msg.includes("یافت نشد")) status = 404;
    else if (msg.includes("قبلا رزرو شده")) status = 409; // Conflict
    else status = 400;

    return res.status(status).json({ message: msg });
  }
};

// ----------------- استعلام نوبت بر اساس کد ملی -----------------
export const FindAppointmentController = async (
  req: Request,
  res: Response
) => {
  try {
    const { nationalCode } = req.body;

    if (!nationalCode) {
      return res.status(400).json({ message: "کد ملی الزامی است ❌" });
    }

    const result = await findAppointment(nationalCode);

    if (!result.success) {
      return res.status(404).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("❌ خطا در کنترلر استعلام نوبت:", error);
    return res.status(500).json({ message: "خطای داخلی سرور" });
  }
};

// ----------------- دریافت نوبت‌های روزانه -----------------
export const GetAppointmentController = async (req: Request, res: Response) => {
  try {
    const appointments = await Appointment.find()
      .populate("doctorId", "name specialty")
      .sort({ appointmentDate: 1, appointmentTime: 1 });

    return res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    console.error("❌ Error fetching appointments:", error);
    return res.status(500).json({
      success: false,
      message: "خطا در دریافت نوبت‌ها",
    });
  }
};
// ----------------- استعلام + لغو نوبت با کد ملی -----------------
export const CancelByNationalCodeController = async (
  req: Request,
  res: Response
) => {
  try {
    const { nationalCode, appointmentId } = req.body;

    if (!nationalCode) {
      return res.status(400).json({ message: "کد ملی الزامی است ❌" });
    }

    // مرحله ۱: همه نوبت‌ها با این کد ملی
    const appointments = await Appointment.find({ nationalCode })
      .populate("doctorId", "name specialty")
      .sort({ appointmentDate: 1, appointmentTime: 1 });

    if (!appointments || appointments.length === 0) {
      return res.status(404).json({ message: "هیچ نوبتی یافت نشد ❌" });
    }

    // مرحله ۲: اگر appointmentId داده شده → لغو همون نوبت
    if (appointmentId) {
      const appointment = await Appointment.findOne({
        _id: appointmentId,
        nationalCode,
      });

      if (!appointment) {
        return res.status(404).json({ message: "نوبت موردنظر یافت نشد ❌" });
      }

      if (appointment.status === "cancelled") {
        return res.status(400).json({ message: "این نوبت قبلاً لغو شده ⚠️" });
      }

      appointment.status = "cancelled";
      await appointment.save();

      return res.status(200).json({
        success: true,
        message: "✅ نوبت با موفقیت لغو شد",
        canceled: appointment,
        remaining: appointments.filter((a) => a.id !== appointmentId),
      });
    }

    // مرحله ۳: اگر فقط کد ملی بود → لیست نوبت‌ها رو برگردون
    return res.status(200).json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    console.error("❌ Error in CancelByNationalCodeController:", error);
    return res.status(500).json({ message: "خطای داخلی سرور" });
  }
};
