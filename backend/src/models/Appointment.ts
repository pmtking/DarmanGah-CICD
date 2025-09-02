// models/Appointment.ts
import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  insuranceType: {
    type: String,
    required: true,
    enum: ["تأمین اجتماعی", "سلامت", "آزاد", "نیروهای مسلح", "سایر"],
  },
  nationalCode: {
    type: String,
    required: true,
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DoctorProfile",
    required: true,
  },
  appointmentDate: {
    type: Date,
    required: true,
  },
  appointmentTime: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "reserved",
    enum: ["reserved", "cancelled", "visited"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Appointment", appointmentSchema);
