import mongoose, { Document, Schema } from "mongoose";

// ---------------------- Interface ---------------------- //
export interface IDoctorProfile extends Document {
  personnel: mongoose.Types.ObjectId;
  personnelName: string;
  nationalId: string;
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
  service: string; // ✅ تغییر داده شد از ObjectId به String
  workingDays: (
    | "شنبه"
    | "یک‌شنبه"
    | "دوشنبه"
    | "سه‌شنبه"
    | "چهارشنبه"
    | "پنج‌شنبه"
    | "جمعه"
  )[];
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
    personnel: { type: Schema.Types.ObjectId, ref: "Personnel", required: true },
    personnelName: { type: String, required: true, trim: true },
    nationalId: { type: String, required: true, trim: true },

    specialty: { type: String, required: true, trim: true },
    specialtyType: {
      type: String,
      enum: [
        "پزشک عمومی","جراح","داخلی","اطفال","پوست و مو","قلب و عروق",
        "رادیولوژی","مامایی","دندان پزشک","اورولوژی","روان شناس",
        "روان پزشک","تغذیه","زنان و زایمان","چشم‌پزشک","گوش حلق بینی",
        "فیزیوتراپ","ارتوپدی","گوارش","عفونی","مغز و اعصاب","ریه",
        "کلیه (نفرولوژی)","غدد","پزشکی ورزشی","طب کار","طب سنتی",
        "پزشکی قانونی","سایر"
      ],
      required: true,
    },

    licenseNumber: { type: String, required: true, trim: true, unique: true },
    service: { type: String, required: true, trim: true }, // ✅ اینجا فقط اسم ذخیره می‌شود

    workingDays: {
      type: [String],
      enum: ["شنبه","یک‌شنبه","دوشنبه","سه‌شنبه","چهارشنبه","پنج‌شنبه","جمعه"],
      default: [],
    },

    workingHours: {
      type: Map,
      of: new Schema({
        shifts: [
          { start: { type: String, required: true }, end: { type: String, required: true }, booked: { type: [String], default: [] } },
        ],
      }),
      default: {},
    },

    roomNumber: { type: String, trim: true },
    isAvailable: { type: Boolean, default: true },

    documents: [
      { title: { type: String, required: true }, fileUrl: { type: String, required: true }, uploadedAt: { type: Date, default: Date.now } },
    ],
  },
  { timestamps: true }
);

// ---------------------- Model ---------------------- //
const DoctorProfile = mongoose.model<IDoctorProfile>("DoctorProfile", DoctorProfileSchema);
export default DoctorProfile;
