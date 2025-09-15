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
  insuranceType: "تأمین اجتماعی" | "سلامت" | "آزاد" | "نیروهای مسلح" | "سایر";
  supplementaryInsurance?: "دی" | "آتیه" | "ایران" | "سایر";
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
    patientName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    relationWithGuardian: { type: String, default: "خود شخص" },
    visitType: {
      type: String,
      required: true,
      enum: ["اولیه", "پیگیری", "اورژانسی"],
    },
    insuranceType: {
      type: String,
      required: true,
      enum: ["تأمین اجتماعی", "سلامت", "آزاد", "نیروهای مسلح", "سایر"],
    },
    supplementaryInsurance: {
      type: String,
      enum: ["دی", "آتیه", "ایران", "سایر"],
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
