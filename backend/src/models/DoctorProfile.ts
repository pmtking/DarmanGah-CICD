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
  bio?: string;
  service: Schema.Types.ObjectId;
  workingDays: ("شنبه" | "یک‌شنبه" | "دوشنبه" | "سه‌شنبه" | "چهارشنبه" | "پنج‌شنبه" | "جمعه")[];
  workingHours: {
    شروع: string;
    پایان: string;
  };
  roomNumber?: string;
  avatarUrl?: string;
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
    personnel: {
      type: Schema.Types.ObjectId,
      ref: "Personnel",
    },

    specialty: {
      type: String,
      required: true,
      trim: true,
    },

    specialtyType: {
      type: String,
      enum: [
        "پزشک عمومی",
        "جراح",
        "داخلی",
        "اطفال",
        "پوست",
        "رادیولوژی",
        "سایر",
      ],
      required: true,
    },

    licenseNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    bio: {
      type: String,
      maxlength: 10000,
    },

    service: { type: String, required: true },

    workingDays: {
      type: [String],
      enum: ["شنبه", "یک‌شنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه", "جمعه"],
      default: [],
    },

    workingHours: {
      شروع: { type: String, required: true },
      پایان: { type: String, required: true },
    },

    roomNumber: {
      type: String,
      trim: true,
    },

    avatarUrl: {
      type: String,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

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

// ---------------------- Export ---------------------- //
export default DoctorProfile;
