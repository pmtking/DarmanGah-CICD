// _______________ pmt king coding _______________________ //
// imports
import { Response, Request } from "express";
import {
  findAppointment,
  reserveAppointment,
} from "../services/appointmentService";

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



export const FindAppointmentController = async (req: Request, res: Response) => {
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
