import mongoose, { Document, model, Schema } from "mongoose";
//  ---------------------- types --------------------//
//  roles
export type Role = "DOCTOR" | "NURSE" | "RECEPTION" | "MANAGER" | "SERVICE";
// ن.ع slaryTypes
export type SalaryType = "FIXED" | "PERCENTAGE";
// types presonnel
export interface IPersonnel extends Document {
  name: string;
  nationalId: string;
  phone?: string;
  gender?: "MALE " | "FEMALE" | "OTHER";
  role: Role;
  salaryType: SalaryType;
  isActive: boolean;
  hireAt: Date;
  lastLogin: Date;
  currentShift?: mongoose.Types.ObjectId;
  shifts: mongoose.Types.ObjectId[];
  performances: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

//  ------------------------------------ schma mongo ----------------- //

const personnelSchema = new Schema<IPersonnel>(
  {
    name: { type: String, required: true },
    nationalId: { type: String, required: true, unique: true },
    phone: { type: String },
    gender: { type: String, enum: ["MALE", "FEMALE", "OTHER"] },
    role: {
      type: String,
      enum: ["DOCTOR", "NURSE", "RECEPTION", "MANAGER", "SERVICE"],
      required: true,
    },
    salaryType: {
      type: String,
      enum: ["FIXED", "PERCENTAGE"],
      default: "FIXED",
    },
    isActive: { type: Boolean, default: true },
    hireAt: { type: Date, default: Date.now },
    lastLogin: { type: Date },
    currentShift: {
      type: Schema.Types.ObjectId,
      ref: "Shift",
      default: null,
    },
    shifts: [{ type: Schema.Types.ObjectId, ref: "Shift" }],
    performances: [{ type: Schema.Types.ObjectId, ref: "Performance" }],
  },
  {
    timestamps: true,
  }
);


const Personnel = model<IPersonnel>("Personnel", personnelSchema)

export default Personnel ;