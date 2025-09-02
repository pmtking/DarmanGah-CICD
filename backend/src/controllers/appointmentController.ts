// _______________ pmt king coding _______________________ //
// imports
import { Response, Request } from "express";
import { reserveAppointment } from "../services/appointmentService";

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
