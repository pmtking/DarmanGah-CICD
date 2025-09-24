// ___________________________ pmt king coding ___________________ //

import Appointment from "../models/Appointment";
import DoctorProfile from "../models/DoctorProfile";

// ___________________________ pmt king coding ___________________ //


export const reserveAppointment = async (data: {
  fullName: string;
  phoneNumber: string;
  insuranceType: string;
  nationalCode: string;
  doctorId: string;
  appointmentDate: Date;
  appointmentTime: string;
}) => {
  try {
    const {
      fullName,
      phoneNumber,
      insuranceType,
      nationalCode,
      doctorId,
      appointmentDate,
      appointmentTime,
    } = data;

    // بررسی پر بودن همه فیلدها
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

    // بررسی وجود پزشک
    const doctor = await DoctorProfile.findOne({ personnel: doctorId });
    if (!doctor) {
      throw new Error("پزشک یافت نشد ❌");
    }

    // بررسی تاریخ گذشته
    // if (new Date(appointmentDate) < new Date()) {
    //   throw new Error("نمی‌توان برای تاریخ گذشته نوبت رزرو کرد ❌");
    // }

    // بررسی تداخل نوبت
    const conflict = await Appointment.findOne({
      doctorId,
      appointmentDate,
      appointmentTime,
      status: "reserved",
    });

    if (conflict) {
      throw new Error("این نوبت قبلاً رزرو شده است ❌");
    }

    // ایجاد نوبت جدید
    const appointment = new Appointment({
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

    return { success: true, message: "رزرو با موفقیت انجام شد ✅" };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export const findAppointment = async (nationalCode: string) => {
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
    const appointments = await Appointment.find({ nationalCode }).populate(
      "doctorId",
      "name specialty"
    );

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
    console.error("❌ خطا در استعلام نوبت:", error.message);
    return {
      success: false,
      message: "خطا در پردازش درخواست ❌",
      error: error.message,
      data: null,
    };
  }
};


// export const findAppointment = async (nationalCode: string) => {
//   try {
//     // اعتبارسنجی اولیه
//     if (!nationalCode || nationalCode.length !== 10) {
//       return {
//         success: false,
//         message: "کد ملی باید 10 رقم باشد ❌",
//         data: null,
//       };
//     }

//     // جستجوی نوبت در دیتابیس
//     const appointment = await Appointment.findOne({ nationalCode });

//     if (!appointment) {
//       return {
//         success: false,
//         message: "هیچ نوبتی برای این کد ملی ثبت نشده است ❌",
//         data: null,
//       };
//     }

//     return {
//       success: true,
//       message: "نوبت یافت شد ✅",
//       data: appointment,
//     };
//   } catch (error: any) {
//     console.error("❌ خطا در استعلام نوبت:", error.message);
//     return {
//       success: false,
//       message: "خطا در پردازش درخواست",
//       error: error.message,
//       data: null,
//     };
//   }
// };