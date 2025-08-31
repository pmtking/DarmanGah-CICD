// -------------------------- imports ------------------- //

import mongoose from "mongoose";
import DoctorProfile from "../models/DoctorProfile";
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
  return await DoctorProfile.find()
    .populate("Personnel")
    .populate("ClinicService");
};

// --------------------- get profile By Id ------------------ //
export const getDoctorProfileById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("Invalid ID");
  return await DoctorProfile.findById(id)
    .populate("Personnel")
    .populate("ClinicService");
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
