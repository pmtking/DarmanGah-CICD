"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upsertProfile = exports.uploadDocument = exports.changeAvailability = exports.deleteProfile = exports.updateProfile = exports.getProfileById = exports.findDoctor = exports.getAllDoctorsController = exports.getProfiles = exports.createProfile = void 0;
const doctorProfileService_1 = require("../services/doctorProfileService");
const doctorProfile_validation_1 = require("../validations/doctorProfile.validation");
const Personnel_1 = __importDefault(require("../models/Personnel"));
const DoctorProfile_1 = __importDefault(require("../models/DoctorProfile"));
// پایه مسیر API برای فایل‌ها
const API_BASE = process.env.API_BASE || "http://localhost:4000";
// ---------------------- ایجاد پروفایل پزشک ---------------------- //
const createProfile = async (req, res) => {
    try {
        console.log("🔹 createProfile called", req.body);
        const { error } = doctorProfile_validation_1.createDoctorProfileSchema.validate(req.body);
        if (error)
            return res.status(400).json({ message: error.details[0].message });
        const personnel = await Personnel_1.default.findOne({
            $or: [
                { nationalId: req.body.nationalId?.trim() },
                { name: req.body.name?.trim() },
            ],
        });
        if (!personnel)
            return res.status(404).json({ message: "پرسنل پیدا نشد" });
        if (personnel.role !== "DOCTOR")
            return res
                .status(400)
                .json({ message: "فقط پرسنل با نقش پزشک قابل انتخاب است" });
        const profile = await (0, doctorProfileService_1.createDoctorProfile)(req.body);
        res.status(201).json(profile);
    }
    catch (err) {
        console.error("❌ createProfile Error:", err);
        res.status(500).json({ message: "خطا در ایجاد پروفایل", error: err.message });
    }
};
exports.createProfile = createProfile;
// ---------------------- دریافت همه پروفایل‌ها ---------------------- //
const getProfiles = async (_req, res) => {
    try {
        console.log("🔹 getProfiles called");
        const profiles = await DoctorProfile_1.default.find()
            .populate({
            path: "personnel",
            select: "name avatar phone nationalId role",
        })
            .sort({ updatedAt: -1 });
        const validProfiles = profiles.filter((p) => p.personnel);
        const uniqueProfilesMap = new Map();
        validProfiles.forEach((profile) => {
            const id = String(profile.personnel._id);
            if (!uniqueProfilesMap.has(id))
                uniqueProfilesMap.set(id, profile);
        });
        const formattedProfiles = Array.from(uniqueProfilesMap.values()).map((p) => {
            const personnel = p.personnel;
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
                    ? `/uploads/avatars/${personnel.avatar.split("/").pop()}`
                    : "/images/default.png",
                documents: p.documents || [],
                service: p.service || "سایر",
            };
        });
        res.status(200).json(formattedProfiles);
    }
    catch (err) {
        console.error("❌ getProfiles Error:", err);
        res.status(500).json({ message: "خطا در دریافت لیست پزشکان", error: err.message });
    }
};
exports.getProfiles = getProfiles;
// ---------------------- دریافت همه پزشکان بدون فیلتر ---------------------- //
const getAllDoctorsController = async (_req, res) => {
    try {
        console.log("🔹 getAllDoctorsController called");
        const doctors = await DoctorProfile_1.default.find()
            .populate({
            path: "personnel",
            select: "name avatar phone nationalId role",
        })
            .sort({ updatedAt: -1 });
        const formattedDoctors = doctors
            .filter((doc) => doc.personnel)
            .map((doc) => {
            const personnel = doc.personnel;
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
    }
    catch (err) {
        console.error("❌ getAllDoctorsController Error:", err);
        res.status(500).json({ message: "خطا در گرفتن لیست پزشک‌ها", error: err.message });
    }
};
exports.getAllDoctorsController = getAllDoctorsController;
// ------------------------- پیدا کردن پزشکان از مدل پرسنل ------------------------ //
const findDoctor = async (req, res) => {
    try {
        console.log("🔹 findDoctor called");
        const doctors = await Personnel_1.default.find({ role: "DOCTOR" }).select("name avatar _id phone nationalId");
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
    }
    catch (err) {
        console.error("❌ findDoctor Error:", err);
        res.status(500).json({ message: "خطا در دریافت پزشکان", error: err.message });
    }
};
exports.findDoctor = findDoctor;
// ---------------------- دریافت پروفایل با آیدی ---------------------- //
const getProfileById = async (req, res) => {
    try {
        console.log("🔹 getProfileById called", req.params.id);
        const profile = await (0, doctorProfileService_1.getDoctorProfileById)(req.params.id);
        if (!profile)
            return res.status(404).json({ message: "پروفایل پیدا نشد" });
        res.status(200).json(profile);
    }
    catch (err) {
        console.error("❌ getProfileById Error:", err);
        res.status(500).json({ message: "خطا در دریافت پروفایل", error: err.message });
    }
};
exports.getProfileById = getProfileById;
// ---------------------- بروزرسانی پروفایل ---------------------- //
const updateProfile = async (req, res) => {
    try {
        console.log("🔹 updateProfile called", req.params.id);
        const updated = await (0, doctorProfileService_1.updateDoctorProfile)(req.params.id, req.body);
        if (!updated)
            return res.status(404).json({ message: "پروفایل برای بروزرسانی پیدا نشد" });
        res.status(200).json(updated);
    }
    catch (err) {
        console.error("❌ updateProfile Error:", err);
        res.status(500).json({ message: "خطا در بروزرسانی پروفایل", error: err.message });
    }
};
exports.updateProfile = updateProfile;
// ---------------------- حذف پروفایل ---------------------- //
const deleteProfile = async (req, res) => {
    try {
        console.log("🔹 deleteProfile called", req.params.id);
        const deleted = await (0, doctorProfileService_1.deleteDoctorProfile)(req.params.id);
        if (!deleted)
            return res.status(404).json({ message: "پروفایل برای حذف پیدا نشد" });
        res.status(200).json({ message: "پروفایل با موفقیت حذف شد" });
    }
    catch (err) {
        console.error("❌ deleteProfile Error:", err);
        res.status(500).json({ message: "خطا در حذف پروفایل", error: err.message });
    }
};
exports.deleteProfile = deleteProfile;
// ---------------------- تغییر وضعیت دسترسی ---------------------- //
const changeAvailability = async (req, res) => {
    try {
        console.log("🔹 changeAvailability called", req.params.id, req.body);
        const updated = await (0, doctorProfileService_1.toggleAvailability)(req.params.id, req.body.isAvailable);
        if (!updated)
            return res.status(404).json({ message: "پروفایل پیدا نشد" });
        res.status(200).json(updated);
    }
    catch (err) {
        console.error("❌ changeAvailability Error:", err);
        res.status(500).json({ message: "خطا در تغییر وضعیت", error: err.message });
    }
};
exports.changeAvailability = changeAvailability;
// ---------------------- افزودن مدرک جدید ---------------------- //
const uploadDocument = async (req, res) => {
    try {
        console.log("🔹 uploadDocument called", req.params.id, req.body);
        const { title, fileUrl } = req.body;
        if (!title || !fileUrl)
            return res.status(400).json({ message: "عنوان و فایل الزامی است" });
        const updated = await (0, doctorProfileService_1.addDocument)(req.params.id, { title, fileUrl });
        if (!updated)
            return res.status(404).json({ message: "پروفایل پیدا نشد" });
        res.status(200).json(updated);
    }
    catch (err) {
        console.error("❌ uploadDocument Error:", err);
        res.status(500).json({ message: "خطا در افزودن مدرک", error: err.message });
    }
};
exports.uploadDocument = uploadDocument;
// ---------------------- ایجاد یا آپدیت پروفایل (upsert) ---------------------- //
const upsertProfile = async (req, res) => {
    try {
        console.log("🔹 upsertProfile called", req.body);
        const { error } = doctorProfile_validation_1.createDoctorProfileSchema.validate(req.body);
        if (error)
            return res.status(400).json({ message: error.details[0].message });
        const { nationalId, specialty, specialtyType, workingDays, workingHours, roomNumber, licenseNumber, isAvailable, documents, service, } = req.body;
        const personnel = await Personnel_1.default.findOne({ nationalId: nationalId?.trim() });
        if (!personnel)
            return res.status(404).json({ message: "پرسنل با این کد ملی پیدا نشد" });
        if (personnel.role !== "DOCTOR")
            return res.status(400).json({ message: "فقط پرسنل با نقش پزشک قابل انتخاب است" });
        const profile = await DoctorProfile_1.default.findOneAndUpdate({ personnel: personnel._id }, {
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
                documents: documents?.map((doc) => ({
                    title: doc.title,
                    fileUrl: doc.fileUrl,
                    uploadedAt: doc.uploadedAt ? new Date(doc.uploadedAt) : new Date(),
                })) ?? [],
            },
        }, { new: true, upsert: true });
        res.status(200).json({ message: "✅ اطلاعات پزشک با موفقیت ذخیره شد", profile });
    }
    catch (err) {
        console.error("❌ upsertProfile Error:", err);
        res.status(500).json({ message: "خطا در ذخیره اطلاعات", error: err.message });
    }
};
exports.upsertProfile = upsertProfile;
