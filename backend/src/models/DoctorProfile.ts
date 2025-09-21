import mongoose, { Document, Schema } from "mongoose";

// ---------------------- Interface ---------------------- //
export interface IDoctorProfile extends Document {
  personnel: mongoose.Types.ObjectId;
  specialty: string;
  specialtyType:
    | "پزشک عمومی"
    | "جراح"
    | "داخلی"
    | "اطفال"
    | "پوست"
    | "رادیولوژی"
    | "سایر";
  licenseNumber: string;
  service: Schema.Types.ObjectId;
  workingDays: ("شنبه" | "یک‌شنبه" | "دوشنبه" | "سه‌شنبه" | "چهارشنبه" | "پنج‌شنبه" | "جمعه")[];
  workingHours: {
    [day: string]: {
      shifts: { start: string; end: string; booked?: string[] }[];
    };
  };
  roomNumber?: string;
  isAvailable: boolean;
  documents: {
    title: string;
    fileUrl: string;
    uploadedAt: Date;
  }[];
}

// ---------------------- Schema ---------------------- //
const DoctorProfileSchema = new Schema<IDoctorProfile>(
  {
    personnel: { type: Schema.Types.ObjectId, ref: "Personnel" },

    specialty: { type: String, required: true, trim: true },

    specialtyType: {
      type: String,
      enum: ["پزشک عمومی", "جراح", "داخلی", "اطفال", "پوست", "رادیولوژی", "سایر"],
      required: true,
    },

    licenseNumber: { type: String, required: true, unique: true, trim: true },

    service: { type: String, required: true },

    workingDays: {
      type: [String],
      enum: ["شنبه", "یک‌شنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه", "جمعه"],
      default: [],
    },

    // شیفت‌ها
    workingHours: {
      type: Map,
      of: new Schema({
        shifts: [
          {
            start: { type: String, required: true },
            end: { type: String, required: true },
            booked: { type: [String], default: [] },
          },
        ],
      }),
      default: {},
    },

    roomNumber: { type: String, trim: true },

    isAvailable: { type: Boolean, default: true },

    documents: [
      {
        title: { type: String, required: true },
        fileUrl: { type: String, required: true },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

// ---------------------- Model ---------------------- //
const DoctorProfile = mongoose.model("DoctorProfile", DoctorProfileSchema);

export default DoctorProfile;
