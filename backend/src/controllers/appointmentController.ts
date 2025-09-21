// _______________ pmt king coding _______________________ //
// imports
import { Response, Request } from "express";
import {
  findAppointment,
  reserveAppointment,
} from "../services/appointmentService";
import Appointment from "../models/Appointment";
import jalaali from "jalaali-js";
export const ReserveAppointmentController = async (
  req: Request,
  res: Response
) => {
  try {
    const appointment = await reserveAppointment(req.body);
    res.status(201).json({ message: "نوبت ثبت شد", appointment });
  } catch (error: any) {
    const msg = error.message || "خطا در نوبت ";
    const status = msg.includes("یافت  نشد")
      ? 404
      : msg.includes("قبلا رزرو شده ");
    res.status(400).json({ message: msg });
  }
};

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

export const GetAppointmentController = async (req: Request, res: Response) => {
  try {
    // دریافت تاریخ شمسی امروز
    const today = new Date();
    const { jy, jm, jd } = jalaali.toJalaali(today);

    // تبدیل به میلادی برای محدوده روز
    const { gy, gm, gd } = jalaali.toGregorian(jy, jm, jd);
    const startOfDay = new Date(gy, gm - 1, gd, 0, 0, 0, 0);
    const endOfDay = new Date(gy, gm - 1, gd, 23, 59, 59, 999);

    // دریافت نوبت‌های امروز فقط با وضعیت "reserved"
    const appointments = await Appointment.find({
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
  } catch (error) {
    console.error("Error fetching today's appointments:", error);
    return res.status(500).json({
      success: false,
      message: "خطا در دریافت نوبت‌ها",
    });
  }
};
