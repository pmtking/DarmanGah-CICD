import mongoose, { Document, Schema } from "mongoose";

export interface IDoctorProfile extends Document {
  personnel: mongoose.Types.ObjectId;
  personnelName: string; // نام پرسنل (غیرقابل تغییر)
  nationalId: string;    // شماره ملی (غیرقابل تغییر)
  specialty: string;
  specialtyType:
    | "پزشک عمومی"
    | "جراح"
    | "داخلی"
    | "اطفال"
    | "پوست و مو"
    | "قلب و عروق"
    | "رادیولوژی"
    | "مامایی"
    | "دندان پزشک"
    | "اورولوژی"
    | "روان شناس"
    | "روان پزشک"
    | "تغذیه"
    | "زنان و زایمان"
    | "چشم‌پزشک"
    | "گوش حلق بینی"
    | "فیزیوتراپ"
    | "ارتوپدی"
    | "گوارش"
    | "عفونی"
    | "مغز و اعصاب"
    | "ریه"
    | "کلیه (نفرولوژی)"
    | "غدد"
    | "پزشکی ورزشی"
    | "طب کار"
    | "طب سنتی"
    | "پزشکی قانونی"
    | "سایر";
  licenseNumber: string;
  service: mongoose.Types.ObjectId | string;
  workingDays: string[];
  workingHours: {
    [day: string]: {
      shifts: { start: string; end: string; booked?: string[]; _id?: string }[];
    };
  };
  roomNumber?: string;
  isAvailable: boolean;
  documents: {
    title: string;
    fileUrl: string;
    uploadedAt: Date;
  }[];
  avatarUrl?: string;
  bio?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const DoctorProfileSchema = new Schema<IDoctorProfile>(
  {
    personnel: { type: Schema.Types.ObjectId, ref: "Personnel", required: true },
    personnelName: { type: String, required: true, trim: true }, // غیرقابل آپدیت
    nationalId: { type: String, required: true, unique: true, trim: true }, // غیرقابل آپدیت
    specialty: { type: String, required: true, trim: true },
    specialtyType: {
      type: String,
      enum: [
        "پزشک عمومی",
        "جراح",
        "داخلی",
        "اطفال",
        "پوست و مو",
        "قلب و عروق",
        "رادیولوژی",
        "مامایی",
        "دندان پزشک",
        "اورولوژی",
        "روان شناس",
        "روان پزشک",
        "تغذیه",
        "زنان و زایمان",
        "چشم‌پزشک",
        "گوش حلق بینی",
        "فیزیوتراپ",
        "ارتوپدی",
        "گوارش",
        "عفونی",
        "مغز و اعصاب",
        "ریه",
        "کلیه (نفرولوژی)",
        "غدد",
        "پزشکی ورزشی",
        "طب کار",
        "طب سنتی",
        "پزشکی قانونی",
        "سایر",
      ],
      required: true,
    },
    licenseNumber: { type: String, required: true, trim: true },
    service: { type: Schema.Types.ObjectId, ref: "Service", required: true },
    workingDays: { type: [String], default: [] },
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
    avatarUrl: { type: String },
    bio: { type: String },
  },
  { timestamps: true }
);

const DoctorProfile = mongoose.model<IDoctorProfile>("DoctorProfile", DoctorProfileSchema);

export default DoctorProfile;
