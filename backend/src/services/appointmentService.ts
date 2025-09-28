// imports
import Appointment from "../models/Appointment";
import DoctorProfile from "../models/DoctorProfile";
import { sendAppointmentSMS } from "../utils/sendSms";

const WEEK_DAYS = ["یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه", "جمعه", "شنبه"];

interface ReserveData {
  fullName: string;
  phoneNumber: string;
  insuranceType: string;
  nationalCode: string;
  doctorId: string;
  appointmentDate: string | Date;
  appointmentTime: string;
  forceSMS?: boolean;
}

export const reserveAppointment = async (data: ReserveData) => {
  try {
    const {
      fullName,
      phoneNumber,
      insuranceType,
      nationalCode,
      doctorId,
      appointmentDate,
      appointmentTime,
      forceSMS = false,
    } = data;

    if (!fullName || !phoneNumber || !insuranceType || !nationalCode || !doctorId || !appointmentDate || !appointmentTime) {
      throw new Error("همه فیلدهای اجباری باید پر شوند ❌");
    }

    const doctor = await DoctorProfile.findOne({ personnel: doctorId });
    if (!doctor) throw new Error("پزشک یافت نشد ❌");

    const dateObj = appointmentDate instanceof Date ? appointmentDate : new Date(appointmentDate);

    const conflict = await Appointment.findOne({
      doctorId,
      appointmentDate: dateObj,
      appointmentTime,
      status: "reserved",
    });

    if (conflict && !forceSMS) {
      throw new Error("این نوبت قبلاً رزرو شده است ❌");
    }

    const appointment = new Appointment({
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

    // ---------------- ارسال پیامک با روز هفته و زمان ----------------
    const dayName = WEEK_DAYS[dateObj.getDay()];
    await sendAppointmentSMS({
      phoneNumber,
      day: dayName,
      time: appointmentTime
    });

    return {
      success: true,
      message: "رزرو با موفقیت انجام شد ✅",
      appointment,
    };
  } catch (error: any) {
    console.error("❌ Error in reserveAppointment:", error.message);
    return { success: false, message: error.message };
  }
};

export const findAppointment = async (nationalCode: string) => {
  try {
    if (!nationalCode || nationalCode.length !== 10) {
      return { success: false, message: "کد ملی باید 10 رقم باشد ❌", data: null };
    }

    const appointments = await Appointment.find({ nationalCode })
      .populate("doctorId", "name specialty")
      .sort({ appointmentDate: 1, appointmentTime: 1 });

    if (!appointments || appointments.length === 0) {
      return { success: false, message: "هیچ نوبتی برای این کد ملی ثبت نشده است ❌", data: null };
    }

    const nextAppointment = appointments.find(a => a.status === "reserved");
    if (nextAppointment) {
      const dateObj = nextAppointment.appointmentDate instanceof Date ? nextAppointment.appointmentDate : new Date(nextAppointment.appointmentDate);
      const dayName = WEEK_DAYS[dateObj.getDay()];

      await sendAppointmentSMS({
        phoneNumber: nextAppointment.phoneNumber,
        day: dayName,
        time: nextAppointment.appointmentTime
      });
    }

    return { success: true, message: "نوبت(ها) یافت شد ✅", data: appointments };
  } catch (error: any) {
    console.error("❌ Error in findAppointment:", error.message);
    return { success: false, message: "خطا در پردازش درخواست ❌", error: error.message, data: null };
  }
};
