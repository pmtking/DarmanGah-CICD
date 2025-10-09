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
    const profiles = await DoctorProfile.find({
      personnel: { $ne: null }, // فقط پروفایل‌هایی که پرسنل دارند
    })
      .populate({
        path: "personnel",
        match: { role: "DOCTOR" }, // فقط دکترها
        select: "name avatar phone role nationalId",
      })
      .sort({ updatedAt: -1 }); // جدیدترین‌ها اول

    // 🔹 فیلتر: فقط آن‌هایی که personnel پر شده
    const validProfiles = profiles.filter((p: any) => p.personnel);

    // 🔹 جلوگیری از تکرار پزشکان (اگر دو پروفایل داشت)
    const uniqueProfilesMap = new Map<string, any>();
    for (const profile of validProfiles) {
      const id = String(profile.personnel._id);
      if (!uniqueProfilesMap.has(id)) {
        uniqueProfilesMap.set(id, profile);
      }
    }

    const uniqueProfiles = Array.from(uniqueProfilesMap.values());

    // 🔹 فرمت نهایی برای فرانت
    const formattedProfiles = uniqueProfiles.map((p: any) => ({
      profileId: p._id,
      personnelId: p.personnel._id,
      name: p.personnel.name || "",
      phone: p.personnel.phone || "",
      nationalId: p.personnel.nationalId || "",
      specialty: p.specialty,
      specialtyType: p.specialtyType,
      licenseNumber: p.licenseNumber,
      isAvailable: p.isAvailable,
      workingHours: p.workingHours,
      avatarUrl: p.personnel.avatar
        ? `/uploads/avatars/${p.personnel.avatar.split("/").pop()}`
        : "/images/default.png",
    }));

    res.status(200).json(formattedProfiles);
  } catch (err: any) {
    res.status(500).json({
      message: "❌ خطا در دریافت لیست پزشکان",
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
      "name avatar _id phone nationalId" // ✅ اضافه شد
    );

    const formatted = doctors.map((doc) => ({
      personnelId: doc._id,
      name: doc.name,
      nationalId: doc.nationalId || "", // ✅ اضافه شد
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
      // بروزرسانی مرحله‌ای و استفاده از save()
      existingProfile.name = req.body.name;
      existingProfile.nationalId = req.body.nationalId;
      existingProfile.specialty = req.body.specialty;
      existingProfile.service = req.body.service;
      existingProfile.workingDays = req.body.workingDays;
      existingProfile.workingHours = req.body.workingHours; // شیء nested
      existingProfile.roomNumber = req.body.roomNumber;
      existingProfile.licenseNumber = req.body.licenseNumber;
      existingProfile.isAvailable = req.body.isAvailable;
      existingProfile.personnel = personnel._id;

      profile = await existingProfile.save(); // مهم: save() جایگزین findByIdAndUpdate
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
