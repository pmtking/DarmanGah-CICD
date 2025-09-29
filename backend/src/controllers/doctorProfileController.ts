import { Request, Response } from "express";
import {
  addDocument,
  createDoctorProfile,
  deleteDoctorProfile,
  getAllDoctorProfiles,
  getAllDoctors,
  getDoctorProfileById,
  toggleAvailability,
  updateDoctorProfile,
} from "../services/doctorProfileService";
import { createDoctorProfileSchema } from "../validations/doctorProfile.validation";
import Personnel from "../models/Personnel";
import DoctorProfile from "../models/DoctorProfile";

// ---------------------- ایجاد پروفایل پزشک ---------------------- //
// export const findDoctor = async (req: Request, res: Response) => {
//   const doctors = await Personnel.find({ role: "DOCTOR" });
//   res.status(200).json(doctors);
// };
// کنترلر
export const createProfile = async (req: Request, res: Response) => {
  try {
    const { error } = createDoctorProfileSchema.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    // جستجو بر اساس nationalId یا name
    const personnel = await Personnel.findOne({
      $or: [
        { nationalId: req.body.nationalId?.trim() },
        { name: req.body.name?.trim() },
      ],
    });

    if (!personnel) return res.status(404).json({ message: "پرسنل پیدا نشد" });

    // بررسی نقش پرسنل
    if (personnel.role !== "DOCTOR") {
      return res
        .status(400)
        .json({ message: "فقط پرسنل با نقش پزشک قابل انتخاب است" });
    }

    const data = req.body;
    const profile = await createDoctorProfile(data);

    res.status(201).json(profile);
  } catch (err: any) {
    res
      .status(500)
      .json({ message: "خطا در ایجاد پروفایل", error: err.message });
  }
};

// ---------------------- دریافت همه پروفایل‌ها با عکس پرسنل ---------------------- //
export const getProfiles = async (_req: Request, res: Response) => {
  try {
    // پروفایل‌ها را با اطلاعات پرسنل populate می‌کنیم
    const profiles = await DoctorProfile.find().populate({
      path: "personnel", // فیلد reference به پرسنل
      select: "name avatar phone role", // فقط فیلدهای مورد نیاز
    });

    // ساخت خروجی مناسب برای فرانت
    const formattedProfiles = profiles.map((profile: any) => ({
      profileId: profile._id,
      personnelId: profile.personnel?._id,
      name: profile.personnel?.name || "",
      phone: profile.personnel?.phone || "",
      specialty: profile.specialty,
      specialtyType: profile.specialtyType,
      licenseNumber: profile.licenseNumber,
      isAvailable: profile.isAvailable,
      workingHours: profile.workingHours,
      avatarUrl: profile.personnel?.avatar
        ? `${profile.personnel.avatar}`
        : "/images/default.png",
    }));

    res.status(200).json(formattedProfiles);
  } catch (err: any) {
    res.status(500).json({
      message: "خطا در دریافت لیست پزشکان",
      error: err.message,
    });
  }
};

// -------------------------دریافت با type ------------------------ //
// ------------------------- دریافت همه پزشکان با آواتار ------------------------ //
export const getAllDoctorsController = async (req: Request, res: Response) => {
  try {
    // پروفایل دکتر و اطلاعات پرسنل را populate می‌کنیم
    const doctors = await DoctorProfile.find().populate({
      path: "personnel",
      select: "name avatar role", // فقط فیلدهای مورد نیاز
    });

    // ساخت خروجی مناسب برای فرانت
    const formattedDoctors = doctors.map((doc: any) => ({
      profileId: doc._id,
      personnelId: doc.personnel._id,
      name: doc.personnel.name,
      avatarUrl: doc.personnel.avatar
        ? `/uploads/avatars/${doc.personnel.avatar.split("/").pop()}`
        : "/images/default.png",
      specialty: doc.specialty,
      phone: doc.phone,
      workingHours: doc.workingHours,
      isAvailable: doc.isAvailable,
    }));

    res.status(200).json(formattedDoctors);
  } catch (error) {
    console.error("❌ Error in getAllDoctorsController:", error);
    res.status(500).json({
      message: "خطا در گرفتن لیست پزشک‌ها",
      error,
    });
  }
};

// ------------------------- پیدا کردن پزشکان از مدل پرسنل ------------------------ //
export const findDoctor = async (req: Request, res: Response) => {
  try {
    const doctors = await Personnel.find({ role: "DOCTOR" }).select(
      "name avatar _id phone"
    );

    const formatted = doctors.map((doc) => ({
      personnelId: doc._id,
      name: doc.name,
      avatarUrl: doc.avatar
        ? `/uploads/avatars/${doc.avatar.split("/").pop()}`
        : "/images/default.png",
      phone: doc.phone,
      role: doc.role,
    }));

    res.status(200).json(formatted);
  } catch (err: any) {
    res
      .status(500)
      .json({ message: "خطا در دریافت پزشکان", error: err.message });
  }
};

// ---------------------- دریافت پروفایل با آیدی ---------------------- //
export const getProfileById = async (req: Request, res: Response) => {
  try {
    const profile = await getDoctorProfileById(req.params.id);
    if (!profile) return res.status(404).json({ message: "پروفایل پیدا نشد" });

    res.status(200).json(profile);
  } catch (err: any) {
    res
      .status(500)
      .json({ message: "خطا در دریافت پروفایل", error: err.message });
  }
};

// ---------------------- بروزرسانی پروفایل ---------------------- //
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const updated = await updateDoctorProfile(req.params.id, req.body);
    if (!updated)
      return res
        .status(404)
        .json({ message: "پروفایل برای بروزرسانی پیدا نشد" });

    res.status(200).json(updated);
  } catch (err: any) {
    res
      .status(500)
      .json({ message: "خطا در بروزرسانی پروفایل", error: err.message });
  }
};
// ---------------------- حذف پروفایل ---------------------- //
export const deleteProfile = async (req: Request, res: Response) => {
  try {
    const deleted = await deleteDoctorProfile(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "پروفایل برای حذف پیدا نشد" });

    res.status(200).json({ message: "پروفایل با موفقیت حذف شد" });
  } catch (err: any) {
    res.status(500).json({ message: "خطا در حذف پروفایل", error: err.message });
  }
};

// ---------------------- تغییر وضعیت دسترسی ---------------------- //
export const changeAvailability = async (req: Request, res: Response) => {
  try {
    const updated = await toggleAvailability(
      req.params.id,
      req.body.isAvailable
    );
    if (!updated) return res.status(404).json({ message: "پروفایل پیدا نشد" });

    res.status(200).json(updated);
  } catch (err: any) {
    res.status(500).json({ message: "خطا در تغییر وضعیت", error: err.message });
  }
};

// ---------------------- افزودن مدرک جدید ---------------------- //
export const uploadDocument = async (req: Request, res: Response) => {
  try {
    const { title, fileUrl } = req.body;
    if (!title || !fileUrl)
      return res.status(400).json({ message: "عنوان و فایل الزامی است" });

    const updated = await addDocument(req.params.id, { title, fileUrl });
    if (!updated) return res.status(404).json({ message: "پروفایل پیدا نشد" });

    res.status(200).json(updated);
  } catch (err: any) {
    res.status(500).json({ message: "خطا در افزودن مدرک", error: err.message });
  }
};

// ---------------------- ایجاد یا بروزرسانی پروفایل ---------------------- //
export const upsertProfile = async (req: Request, res: Response) => {
  try {
    const { error } = createDoctorProfileSchema.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const { nationalId, name, workingHours } = req.body;

    // جستجو بر اساس nationalId یا name
    const personnel = await Personnel.findOne({
      $or: [{ nationalId: nationalId?.trim() }, { name: name?.trim() }],
    });

    if (!personnel) return res.status(404).json({ message: "پرسنل پیدا نشد" });

    if (personnel.role !== "DOCTOR") {
      return res
        .status(400)
        .json({ message: "فقط پرسنل با نقش پزشک قابل انتخاب است" });
    }

    // بررسی وجود پروفایل دکتر
    const existingProfile = await DoctorProfile.findOne({
      personnel: personnel._id,
    });

    let profile;
    if (existingProfile) {
      // بروزرسانی پروفایل
      profile = await DoctorProfile.findByIdAndUpdate(
        existingProfile._id,
        {
          ...req.body,
          personnel: personnel._id,
          workingHours, // حتماً شیفت‌ها را درست بفرستید
        },
        { new: true }
      );
    } else {
      // ایجاد پروفایل جدید
      profile = await DoctorProfile.create({
        ...req.body,
        personnel: personnel._id,
      });
    }

    res.status(200).json({ message: "اطلاعات پزشک ذخیره شد", profile });
  } catch (err: any) {
    res
      .status(500)
      .json({ message: "خطا در ذخیره اطلاعات", error: err.message });
  }
};
