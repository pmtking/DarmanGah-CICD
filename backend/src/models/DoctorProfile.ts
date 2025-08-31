import mongoose, { Document, Schema } from "mongoose";

// ---------------------- Interface ---------------------- //
export interface IDoctorProfile extends Document {
  personnel: mongoose.Types.ObjectId;
  specialty: string;
  specialtyType:
    | "GENERAL"
    | "SURGEON"
    | "INTERNAL"
    | "PEDIATRIC"
    | "DERMATOLOGY"
    | "RADIOLOGY"
    | "OTHER";
  licenseNumber: string;
  bio?: string;
  service: Schema.Types.ObjectId;
  workingDays: string[];
  workingHours: {
    start: string;
    end: string;
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
    // ارتباط با مدل Personnel
    personnel: {
      type: Schema.Types.ObjectId,
      ref: "Personnel",
    },

    // تخصص پزشک
    specialty: {
      type: String,
      required: true,
      trim: true,
    },

    // نوع تخصص (مقدارهای محدود)
    specialtyType: {
      type: String,
      enum: [
        "GENERAL",
        "SURGEON",
        "INTERNAL",
        "PEDIATRIC",
        "DERMATOLOGY",
        "RADIOLOGY",
        "OTHER",
      ],
      required: true,
    },

    // شماره نظام پزشکی
    licenseNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    // بیوگرافی پزشک
    bio: {
      type: String,
      maxlength: 10000,
    },

    // سرویس کلینیکی مرتبط
    service: { type: String, required: true },

    // روزهای کاری پزشک
    workingDays: {
      type: [String],
      enum: [
        "Saturday",
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
      ],
      default: [],
    },

    // ساعات کاری پزشک
    workingHours: {
      start: { type: String, required: true },
      end: { type: String, required: true },
    },

    // شماره اتاق پزشک
    roomNumber: {
      type: String,
      trim: true,
    },

    // آدرس تصویر پروفایل
    avatarUrl: {
      type: String,
    },

    // وضعیت فعال بودن پزشک
    isAvailable: {
      type: Boolean,
      default: true,
    },

    // مدارک بارگذاری‌شده توسط پزشک
    documents: [
      {
        title: { type: String, required: true },
        fileUrl: { type: String, required: true },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],

    // ---------------------- فیلدهای اختیاری ---------------------- //
    // rating: {
    //   type: Number,
    //   min: 0,
    //   max: 5,
    //   default: 0,
    // },
    // approved: {
    //   type: Boolean,
    //   default: false,
    // },
    // social: {
    //   instagram: { type: String },
    //   linkedin: { type: String },
    //   website: { type: String },
    // },
  },
  { timestamps: true }
);

// ---------------------- Model ---------------------- //
const DoctorProfile = mongoose.model("DoctorProfile", DoctorProfileSchema);

// ---------------------- Export ---------------------- //
export default DoctorProfile;
