// models/Reseption.ts
import mongoose, { Document, Schema, Types } from "mongoose";

// اینترفیس برای هر خدمت رزرو شده
export interface IReseptionService {
  serviceId: Types.ObjectId;
  quantity: number;
  price: number; // قیمت هر خدمت بعد از محاسبه بیمه
}

// اینترفیس Reseption
export interface IReseption extends Document {
  patientName: string;
  phoneNumber: string;
  relationWithGuardian?: string;
  visitType: "اولیه" | "پیگیری" | "اورژانسی";
  insuranceType: "تامین اجتماعی" | "تأمین اجتماعی" | "سلامت" | "آزاد" | "نیروهای مسلح" | "سایر";
  supplementaryInsurance?: "دی" | "ملت" | "آتیه سازان" | "دانا" | "آزاد" | "سایر";
  doctorId: Types.ObjectId;
  services: IReseptionService[];
  staffId: Types.ObjectId;
  appointmentDate: Date;
  appointmentTime: string;
  status: "reserved" | "cancelled" | "visited";
  createdAt: Date;
}

const reseptionSchema = new Schema<IReseption>(
  {
    patientName: { type: String, required: true, trim: true },
    phoneNumber: { type: String, required: true, trim: true },
    relationWithGuardian: { type: String, default: "خود شخص", trim: true },
    visitType: {
      type: String,
      required: true,
      enum: ["اولیه", "پیگیری", "اورژانسی"],
      trim: true,
    },
    insuranceType: {
      type: String,
      required: true,
      enum: ["تامین اجتماعی", "تأمین اجتماعی", "سلامت", "آزاد", "نیروهای مسلح", "سایر"],
      trim: true,
    },
    supplementaryInsurance: {
      type: String,
      enum: ["دی", "ملت", "آتیه سازان", "دانا", "آزاد", "سایر"],
      trim: true,
    },
    doctorId: { type: Schema.Types.ObjectId, ref: "DoctorProfile", required: true },
    services: [
      {
        serviceId: { type: Schema.Types.ObjectId, ref: "ClinicService", required: true },
        quantity: { type: Number, default: 1 },
        price: { type: Number, required: true },
      },
    ],
    staffId: { type: Schema.Types.ObjectId, ref: "Personnel", required: true },
    appointmentDate: { type: Date, required: true },
    appointmentTime: { type: String, required: true },
    status: { type: String, enum: ["reserved", "cancelled", "visited"], default: "reserved" },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Reseption = mongoose.model<IReseption>("Reseption", reseptionSchema);

export default Reseption;
