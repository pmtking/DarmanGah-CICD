// appointmentService.ts
import Appointment from "../models/Appointment";
import DoctorProfile from "../models/DoctorProfile";
import { sendCancelSMS, sendReserveSMS } from "../utils/sendSms";


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

// ---------------- رزرو نوبت ----------------
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

    if (
      !fullName ||
      !phoneNumber ||
      !insuranceType ||
      !nationalCode ||
      !doctorId ||
      !appointmentDate ||
      !appointmentTime
    ) {
      throw new Error("همه فیلدهای اجباری باید پر شوند ❌");
    }

    const doctor = await DoctorProfile.findOne({ personnel: doctorId });
    if (!doctor) throw new Error("پزشک یافت نشد ❌");

    const dateObj =
      appointmentDate instanceof Date
        ? appointmentDate
        : new Date(appointmentDate);

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

    // ارسال پیامک رزرو با روز هفته + زمان
    await sendReserveSMS({
      phoneNumber,
      appointmentDate: dateObj,
      appointmentTime,
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

// ---------------- لغو نوبت ----------------
export const cancelAppointment = async (appointmentId: string) => {
  try {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) throw new Error("نوبت موردنظر یافت نشد ❌");
    if (appointment.status === "cancelled")
      throw new Error("این نوبت قبلاً لغو شده ⚠️");

    appointment.status = "cancelled";
    await appointment.save();

    // ارسال پیامک لغو فقط با تاریخ YYYY/MM/DD
    await sendCancelSMS({
      phoneNumber: appointment.phoneNumber,
      appointmentDate: appointment.appointmentDate,
    });

    return {
      success: true,
      message: "نوبت با موفقیت لغو شد ✅",
      canceled: appointment,
    };
  } catch (error: any) {
    console.error("❌ Error in cancelAppointment:", error.message);
    return { success: false, message: error.message };
  }
};

// ---------------- استعلام نوبت بر اساس کد ملی ----------------
export const findAppointment = async (nationalCode: string) => {
  try {
    if (!nationalCode || nationalCode.length !== 10) {
      return {
        success: false,
        message: "کد ملی باید 10 رقم باشد ❌",
        data: null,
      };
    }

    const appointments = await Appointment.find({ nationalCode })
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
  } catch (error: any) {
    console.error("❌ Error in findAppointment:", error.message);
    return {
      success: false,
      message: "خطا در پردازش درخواست ❌",
      error: error.message,
      data: null,
    };
  }
};
