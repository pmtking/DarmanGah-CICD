import { Request, Response } from "express";
import {
  addDocument,
  createDoctorProfile,
  deleteDoctorProfile,
  getDoctorProfileById,
  toggleAvailability,
  updateDoctorProfile,
} from "../services/doctorProfileService";
import { createDoctorProfileSchema } from "../validations/doctorProfile.validation";
import Personnel from "../models/Personnel";
import DoctorProfile, { IDoctorProfile } from "../models/DoctorProfile";

interface IPopulatedPersonnel {
  _id: string;
  name?: string;
  phone?: string;
  nationalId?: string;
  avatar?: string;
  role?: string;
}

interface IFormattedDoctor {
  profileId: string;
  personnelId: string;
  doctorName: string;
  phoneNumber: string;
  nationalId: string;
  specialty?: string;
  specialtyType?: string;
  licenseNumber?: string;
  isAvailable?: boolean;
  workingHours?: any;
  avatarUrl: string;
  documents?: any[];
  service: string;
}

// پایه مسیر API برای فایل‌ها
const API_BASE = process.env.API_BASE || "http://localhost:4000";

// ---------------------- ایجاد پروفایل پزشک ---------------------- //
export const createProfile = async (req: Request, res: Response) => {
  try {
    console.log("🔹 createProfile called", req.body);

    const { error } = createDoctorProfileSchema.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const personnel = await Personnel.findOne({
      $or: [
        { nationalId: req.body.nationalId?.trim() },
        { name: req.body.name?.trim() },
      ],
    });

    if (!personnel) return res.status(404).json({ message: "پرسنل پیدا نشد" });
    if (personnel.role !== "DOCTOR")
      return res
        .status(400)
        .json({ message: "فقط پرسنل با نقش پزشک قابل انتخاب است" });

    const profile = await createDoctorProfile(req.body);

    res.status(201).json(profile);
  } catch (err: any) {
    console.error("❌ createProfile Error:", err);
    res.status(500).json({ message: "خطا در ایجاد پروفایل", error: err.message });
  }
};

// ---------------------- دریافت همه پروفایل‌ها ---------------------- //
export const getProfiles = async (_req: Request, res: Response) => {
  try {
    console.log("🔹 getProfiles called");

    const profiles = await DoctorProfile.find()
      .populate<{ personnel: IPopulatedPersonnel }>({
        path: "personnel",
        select: "name avatar phone nationalId role",
      })
      .sort({ updatedAt: -1 });

    const validProfiles = profiles.filter((p) => p.personnel);

    const uniqueProfilesMap = new Map<string, IDoctorProfile & { personnel: IPopulatedPersonnel }>();
    validProfiles.forEach((profile) => {
      const id = String(profile.personnel._id);
      if (!uniqueProfilesMap.has(id)) uniqueProfilesMap.set(id, profile as any);
    });

    const formattedProfiles: IFormattedDoctor[] = Array.from(uniqueProfilesMap.values()).map((p) => {
      const personnel = p.personnel!;
      return {
        profileId: p._id.toString(),
        personnelId: personnel._id,
        doctorName: personnel.name || "",
        phoneNumber: personnel.phone || "",
        nationalId: personnel.nationalId || "",
        specialty: p.specialty,
        specialtyType: p.specialtyType,
        licenseNumber: p.licenseNumber,
        isAvailable: p.isAvailable,
        workingHours: p.workingHours,
        avatarUrl: personnel.avatar
          ? `${API_BASE}/uploads/avatars/${personnel.avatar.split("/").pop()}`
          : "/images/default.png",
        documents: p.documents || [],
        service: p.service || "سایر",
      };
    });

    res.status(200).json(formattedProfiles);
  } catch (err: any) {
    console.error("❌ getProfiles Error:", err);
    res.status(500).json({ message: "خطا در دریافت لیست پزشکان", error: err.message });
  }
};

// ---------------------- دریافت همه پزشکان بدون فیلتر ---------------------- //
export const getAllDoctorsController = async (_req: Request, res: Response) => {
  try {
    console.log("🔹 getAllDoctorsController called");

    const doctors = await DoctorProfile.find()
      .populate<{ personnel: IPopulatedPersonnel }>({
        path: "personnel",
        select: "name avatar phone nationalId role",
      })
      .sort({ updatedAt: -1 });

    const formattedDoctors: IFormattedDoctor[] = doctors
      .filter((doc) => doc.personnel)
      .map((doc) => {
        const personnel = doc.personnel!;
        return {
          profileId: doc._id.toString(),
          personnelId: personnel._id,
          doctorName: personnel.name || "",
          phoneNumber: personnel.phone || "",
          nationalId: personnel.nationalId || "",
          specialty: doc.specialty,
          specialtyType: doc.specialtyType,
          licenseNumber: doc.licenseNumber,
          isAvailable: doc.isAvailable,
          workingHours: doc.workingHours,
          avatarUrl: personnel.avatar
            ? `${API_BASE}/uploads/avatars/${personnel.avatar.split("/").pop()}`
            : "/images/default.png",
          documents: doc.documents || [],
          service: doc.service || "سایر",
        };
      });

    res.status(200).json(formattedDoctors);
  } catch (err: any) {
    console.error("❌ getAllDoctorsController Error:", err);
    res.status(500).json({ message: "خطا در گرفتن لیست پزشک‌ها", error: err.message });
  }
};

// ------------------------- پیدا کردن پزشکان از مدل پرسنل ------------------------ //
export const findDoctor = async (req: Request, res: Response) => {
  try {
    console.log("🔹 findDoctor called");

    const doctors = await Personnel.find({ role: "DOCTOR" }).select(
      "name avatar _id phone nationalId"
    );

    const formatted = doctors.map((doc) => ({
      personnelId: doc._id,
      name: doc.name,
      nationalId: doc.nationalId || "",
      avatarUrl: doc.avatar
        ? `${API_BASE}/uploads/avatars/${doc.avatar.split("/").pop()}`
        : "/images/default.png",
      phone: doc.phone,
      role: doc.role,
    }));

    res.status(200).json(formatted);
  } catch (err: any) {
    console.error("❌ findDoctor Error:", err);
    res.status(500).json({ message: "خطا در دریافت پزشکان", error: err.message });
  }
};

// ---------------------- دریافت پروفایل با آیدی ---------------------- //
export const getProfileById = async (req: Request, res: Response) => {
  try {
    console.log("🔹 getProfileById called", req.params.id);

    const profile = await getDoctorProfileById(req.params.id);
    if (!profile) return res.status(404).json({ message: "پروفایل پیدا نشد" });

    res.status(200).json(profile);
  } catch (err: any) {
    console.error("❌ getProfileById Error:", err);
    res.status(500).json({ message: "خطا در دریافت پروفایل", error: err.message });
  }
};

// ---------------------- بروزرسانی پروفایل ---------------------- //
export const updateProfile = async (req: Request, res: Response) => {
  try {
    console.log("🔹 updateProfile called", req.params.id);

    const updated = await updateDoctorProfile(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: "پروفایل برای بروزرسانی پیدا نشد" });

    res.status(200).json(updated);
  } catch (err: any) {
    console.error("❌ updateProfile Error:", err);
    res.status(500).json({ message: "خطا در بروزرسانی پروفایل", error: err.message });
  }
};

// ---------------------- حذف پروفایل ---------------------- //
export const deleteProfile = async (req: Request, res: Response) => {
  try {
    console.log("🔹 deleteProfile called", req.params.id);

    const deleted = await deleteDoctorProfile(req.params.id);
    if (!deleted) return res.status(404).json({ message: "پروفایل برای حذف پیدا نشد" });

    res.status(200).json({ message: "پروفایل با موفقیت حذف شد" });
  } catch (err: any) {
    console.error("❌ deleteProfile Error:", err);
    res.status(500).json({ message: "خطا در حذف پروفایل", error: err.message });
  }
};

// ---------------------- تغییر وضعیت دسترسی ---------------------- //
export const changeAvailability = async (req: Request, res: Response) => {
  try {
    console.log("🔹 changeAvailability called", req.params.id, req.body);

    const updated = await toggleAvailability(req.params.id, req.body.isAvailable);
    if (!updated) return res.status(404).json({ message: "پروفایل پیدا نشد" });

    res.status(200).json(updated);
  } catch (err: any) {
    console.error("❌ changeAvailability Error:", err);
    res.status(500).json({ message: "خطا در تغییر وضعیت", error: err.message });
  }
};

// ---------------------- افزودن مدرک جدید ---------------------- //
export const uploadDocument = async (req: Request, res: Response) => {
  try {
    console.log("🔹 uploadDocument called", req.params.id, req.body);

    const { title, fileUrl } = req.body;
    if (!title || !fileUrl)
      return res.status(400).json({ message: "عنوان و فایل الزامی است" });

    const updated = await addDocument(req.params.id, { title, fileUrl });
    if (!updated) return res.status(404).json({ message: "پروفایل پیدا نشد" });

    res.status(200).json(updated);
  } catch (err: any) {
    console.error("❌ uploadDocument Error:", err);
    res.status(500).json({ message: "خطا در افزودن مدرک", error: err.message });
  }
};

// ---------------------- ایجاد یا آپدیت پروفایل (upsert) ---------------------- //
export const upsertProfile = async (req: Request, res: Response) => {
  try {
    console.log("🔹 upsertProfile called", req.body);

    const { error } = createDoctorProfileSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const {
      nationalId,
      specialty,
      specialtyType,
      workingDays,
      workingHours,
      roomNumber,
      licenseNumber,
      isAvailable,
      documents,
      service,
    } = req.body;

    const personnel = await Personnel.findOne({ nationalId: nationalId?.trim() });
    if (!personnel) return res.status(404).json({ message: "پرسنل با این کد ملی پیدا نشد" });
    if (personnel.role !== "DOCTOR")
      return res.status(400).json({ message: "فقط پرسنل با نقش پزشک قابل انتخاب است" });

    const profile = await DoctorProfile.findOneAndUpdate(
      { personnel: personnel._id },
      {
        $set: {
          personnelName: personnel.name,
          nationalId: personnel.nationalId,
          specialty,
          specialtyType,
          service: service ?? "سایر",
          workingDays: workingDays ?? [],
          workingHours: workingHours ?? {},
          roomNumber,
          licenseNumber,
          isAvailable: isAvailable ?? true,
          documents:
            documents?.map((doc: any) => ({
              title: doc.title,
              fileUrl: doc.fileUrl,
              uploadedAt: doc.uploadedAt ? new Date(doc.uploadedAt) : new Date(),
            })) ?? [],
        },
      },
      { new: true, upsert: true }
    );

    res.status(200).json({ message: "✅ اطلاعات پزشک با موفقیت ذخیره شد", profile });
  } catch (err: any) {
    console.error("❌ upsertProfile Error:", err);
    res.status(500).json({ message: "خطا در ذخیره اطلاعات", error: err.message });
  }
};
