// ___________________________ pmt king coding ___________________ //

import Appointment from "../models/Appointment";
import DoctorProfile from "../models/DoctorProfile";

// reserveAppointment

export const reserveAppointment = async (data) => {
  const {
    fullName,
    phoneNumber,
    insuranceType,
    nationalCode,
    doctorId,
    appointmentDate,
    appointmentTime,
  } = data;

  const doctor = await DoctorProfile.findById(doctorId);
  if (!doctor) throw new Error("پزشک یافت نشد");
  const conflict = await Appointment.findOne({
    doctorId,
    appointmentDate,
    appointmentTime,
    status: "reserved",
  });
  if (conflict) {
    throw new Error("این نوبت قبلا رزرو شده");
  }
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
  return appointment;
};
