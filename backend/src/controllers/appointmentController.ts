// _______________ pmt king coding _______________________ //
// imports
import { Response, Request } from "express";
import {
  findAppointment,
  reserveAppointment,
} from "../services/appointmentService";
import Appointment from "../models/Appointment";
import jalaali from "jalaali-js";

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
    const { date, doctorId } = req.query;

    let targetDate: Date;

    if (date) {
      // اگر تاریخ از query بیاد (yyyy-mm-dd)
      targetDate = new Date(date as string);
    } else {
      // تاریخ امروز به شمسی → برگردوندن به میلادی
      const today = new Date();
      const { jy, jm, jd } = jalaali.toJalaali(today);
      const { gy, gm, gd } = jalaali.toGregorian(jy, jm, jd);
      targetDate = new Date(gy, gm - 1, gd);
    }

    const startOfDay = new Date(
      targetDate.getFullYear(),
      targetDate.getMonth(),
      targetDate.getDate(),
      0,
      0,
      0,
      0
    );
    const endOfDay = new Date(
      targetDate.getFullYear(),
      targetDate.getMonth(),
      targetDate.getDate(),
      23,
      59,
      59,
      999
    );

    const filter: any = {
      appointmentDate: { $gte: startOfDay, $lte: endOfDay },
      status: "reserved",
    };
    if (doctorId) filter.doctorId = doctorId;

    const appointments = await Appointment.find(filter)
      .populate("doctorId", "name specialty") // اصلاح فیلدها مطابق مدل Doctor
      .sort({ appointmentTime: 1 });

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
