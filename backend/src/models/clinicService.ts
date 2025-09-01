import mongoose, { Schema, Document } from "mongoose";

export interface IInsurance {
  _id?: mongoose.Types.ObjectId; // id یکتا برای ویرایش
  companyName: string;
  contractPrice: number;
}

export interface IClinicService extends Document {
  serviceCode: string;
  serviceName: string;
  serviceGroup: string;
  pricePublic: number;
  priceGovernmental: number;
  baseInsurances: IInsurance[];          // لیست بیمه‌های پایه
  supplementaryInsurances: IInsurance[]; // لیست بیمه‌های تکمیلی
  isFreeForStaff: boolean;
}

const InsuranceSchema = new Schema<IInsurance>({
  companyName: { type: String, required: true, trim: true },
  contractPrice: { type: Number, required: true },
});

const ClinicServiceSchema = new Schema<IClinicService>(
  {
    serviceCode: { type: String, required: true, unique: true, trim: true },
    serviceName: { type: String, required: true, trim: true },
    serviceGroup: { type: String, required: true, trim: true },
    pricePublic: { type: Number, required: true },
    priceGovernmental: { type: Number, required: true },
    baseInsurances: { type: [InsuranceSchema], default: [] },          // آرایه بیمه پایه
    supplementaryInsurances: { type: [InsuranceSchema], default: [] }, // آرایه بیمه تکمیلی
    isFreeForStaff: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const ClinicService = mongoose.model<IClinicService>("ClinicService", ClinicServiceSchema);

export default ClinicService;
