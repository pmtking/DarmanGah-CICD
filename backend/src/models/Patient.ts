import mongoose, { Schema, Document, Types } from "mongoose";
import { IReseption } from "./Reseption";

interface ILabTest {
  testName: string;
  result?: string;
  date: Date;
}

interface IImaging {
  type: string; // مانند X-Ray, MRI
  fileUrl: string;
  date: Date;
  notes?: string;
}

export interface IPatientProfile extends Document {
  nationalId: string;
  name: string;
  phoneNumber?: string;
  relationWithGuardian?: string;
  visits: Types.ObjectId[]; // لیست مراجعه‌ها (Ref به Reseption)
  labTests: ILabTest[];
  imaging: IImaging[];
}

const LabTestSchema = new Schema<ILabTest>({
  testName: { type: String, required: true },
  result: { type: String },
  date: { type: Date, default: Date.now },
});

const ImagingSchema = new Schema<IImaging>({
  type: { type: String, required: true },
  fileUrl: { type: String, required: true },
  date: { type: Date, default: Date.now },
  notes: { type: String },
});

const PatientProfileSchema = new Schema<IPatientProfile>(
  {
    nationalId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    phoneNumber: { type: String },
    relationWithGuardian: { type: String, default: "خود شخص" },
    visits: [{ type: Schema.Types.ObjectId, ref: "Reseption" }],
    labTests: [LabTestSchema],
    imaging: [ImagingSchema],
  },
  { timestamps: true }
);

const PatientProfile = mongoose.model<IPatientProfile>(
  "PatientProfile",
  PatientProfileSchema
);

export default PatientProfile;
