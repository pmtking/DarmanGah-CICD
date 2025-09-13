// -------------------------- imports ------------------- //

import mongoose from "mongoose";
import DoctorProfile, { IDoctorProfile } from "../models/DoctorProfile";
import Personnel from "../models/Personnel";

// -------------------------- add profile -------------- //

export const createDoctorProfile = async (data: any) => {
  // پیدا کردن پرسنل بر اساس nationalId یا name
  console.log("Searching Personnel with:", data.nationalId, data.name);
  const personnel = await Personnel.findOne({
    $or: [{ nationalId: data.nationalId?.trim() }, { name: data.name?.trim() }],
  });

  if (!personnel) throw new Error("پرسنل پیدشسشسشسا نشد");

  // ساخت پروفایل با ObjectId واقعی
  const profile = new DoctorProfile({
    ...data,
    personnel: personnel._id, // اینجا ObjectId ذخیره می‌شود
  });

  return await profile.save();
};

//  ---------------------- find all profiles --------------- //

export const getAllDoctorProfiles = async () => {
  try {
    // مرحله ۱: دریافت پرسنل‌هایی که نقش‌شون پزشک هست و فعال هستند
    const doctors = await Personnel.find({
      role: "DOCTOR",
      isActive: true,
    }).select("name phone nationalId gender");

    // تعیین روز فعلی (فارسی)
    const weekDays = [
      "یک‌شنبه",
      "دوشنبه",
      "سه‌شنبه",
      "چهارشنبه",
      "پنج‌شنبه",
      "جمعه",
      "شنبه",
    ];
    const todayIndex = new Date().getDay(); // 0 یکشنبه، 6 شنبه
    const today = weekDays[todayIndex === 0 ? 0 : todayIndex]; // روز فعلی فارسی

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes(); // زمان فعلی به دقیقه

    // مرحله ۲: دریافت پروفایل‌های مرتبط و فیلتر پزشکان فعال در روز جاری و زمان مناسب
    const profiles = await Promise.all(
      doctors.map(async (doctor) => {
        const profile = await DoctorProfile.findOne({ personnel: doctor._id });

        if (!profile) return null;

        // فقط پزشکان فعال در روز جاری را برگردان
        if (!profile.isAvailable || !profile.workingDays.includes(today))
          return null;

        // بررسی زمان پایان
        const [endHour, endMinute] = profile.workingHours.پایان
          .split(":")
          .map(Number);
        const endTimeInMinutes = endHour * 60 + endMinute;

        if (currentTime > endTimeInMinutes) return null; // اگر زمان گذشته بود حذف شود

        return {
          personnelId: doctor._id,
          name: doctor.name,
          phone: doctor.phone,
          nationalId: doctor.nationalId,
          gender: doctor.gender,
          doctorProfileId: profile._id,
          specialty: profile.specialty,
          specialtyType: profile.specialtyType,
          licenseNumber: profile.licenseNumber,
          avatarUrl: profile.avatarUrl,
          isAvailable: profile.isAvailable,
          workingHours: profile.workingHours,
          workingDays: profile.workingDays,
        };
      })
    );

    // حذف null‌ها
    return profiles.filter((p) => p !== null);
  } catch (err: any) {
    console.error("خطا در دریافت پروفایل پزشکان:", err.message);
    throw new Error("خطا در دریافت پروفایل پزشکان");
  }
};

export const getAllDoctors = async (
  type?: "general" | "specialist"
): Promise<IDoctorProfile[]> => {
  try {
    let filter: Record<string, any> = {};

    if (type === "general") {
      filter.specialty = "عمومی";
    } else if (type === "specialist") {
      filter.specialty = "متخصص";
    }

    const data = await DoctorProfile.find(filter);
    return data;
  } catch (error) {
    console.error("Error in getAllDoctors:", error);
    throw error;
  }
};

// --------------------- get profile By Id ------------------ //
export const getDoctorProfileById = async (id) => {
  return await DoctorProfile.findOne({ personnel: id });
};

//  --------------------- update Profile --------------- //
export const updateDoctorProfile = async (id, updates) => {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("Invalid Id");
  return await DoctorProfile.findByIdAndUpdate(id, updates, { new: true });
};
//  -------------------------- deleteProfile --------------- //
export const deleteDoctorProfile = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("Invalid Id");
  return await DoctorProfile.findByIdAndDelete(id);
};

//  ------------------------ toggleAvailability  --------------- //

export const toggleAvailability = async (id, isAvailable) => {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("Invali Id");
  return await DoctorProfile.findByIdAndUpdate(
    id,
    { isAvailable },
    { new: true }
  );
};

//  ---------------------------- add document ----------------- //

export const addDocument = async (id, document) => {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("Invalid ID");
  return await DoctorProfile.findByIdAndUpdate(
    id,
    { $push: { documents: { ...document, uploadedAt: new Date() } } },
    { new: true }
  );
};
