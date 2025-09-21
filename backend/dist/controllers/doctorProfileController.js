"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upsertProfile = exports.uploadDocument = exports.changeAvailability = exports.deleteProfile = exports.updateProfile = exports.getProfileById = exports.getAllDoctorsController = exports.getProfiles = exports.createProfile = exports.findDoctor = void 0;
const doctorProfileService_1 = require("../services/doctorProfileService");
const doctorProfile_validation_1 = require("../validations/doctorProfile.validation");
const Personnel_1 = __importDefault(require("../models/Personnel"));
const DoctorProfile_1 = __importDefault(require("../models/DoctorProfile"));
// ---------------------- ایجاد پروفایل پزشک ---------------------- //
const findDoctor = async (req, res) => {
    const doctors = await Personnel_1.default.find({ role: "DOCTOR" });
    res.status(200).json(doctors);
};
exports.findDoctor = findDoctor;
// کنترلر
const createProfile = async (req, res) => {
    try {
        const { error } = doctorProfile_validation_1.createDoctorProfileSchema.validate(req.body);
        if (error)
            return res.status(400).json({ message: error.details[0].message });
        // جستجو بر اساس nationalId یا name
        const personnel = await Personnel_1.default.findOne({
            $or: [
                { nationalId: req.body.nationalId?.trim() },
                { name: req.body.name?.trim() },
            ],
        });
        if (!personnel)
            return res.status(404).json({ message: "پرسنل پیدا نشد" });
        // بررسی نقش پرسنل
        if (personnel.role !== "DOCTOR") {
            return res
                .status(400)
                .json({ message: "فقط پرسنل با نقش پزشک قابل انتخاب است" });
        }
        const data = req.body;
        const profile = await (0, doctorProfileService_1.createDoctorProfile)(data);
        res.status(201).json(profile);
    }
    catch (err) {
        res
            .status(500)
            .json({ message: "خطا در ایجاد پروفایل", error: err.message });
    }
};
exports.createProfile = createProfile;
// ---------------------- دریافت همه پروفایل‌ها ---------------------- //
const getProfiles = async (_req, res) => {
    try {
        const profiles = await (0, doctorProfileService_1.getAllDoctorProfiles)();
        res.status(200).json(profiles);
    }
    catch (err) {
        res
            .status(500)
            .json({ message: "خطا در دریافت لیست پزشکان", error: err.message });
    }
};
exports.getProfiles = getProfiles;
// -------------------------دریافت با type ------------------------ //
const getAllDoctorsController = async (req, res) => {
    try {
        const doctors = await DoctorProfile_1.default.find();
        // اگه بخوای سرویس هم بیاد
        res.status(200).json(doctors);
    }
    catch (error) {
        console.error("❌ Error in getAllDoctorsController:", error);
        res.status(500).json({
            message: "خطا در گرفتن لیست پزشک‌ها",
            error,
        });
    }
};
exports.getAllDoctorsController = getAllDoctorsController;
// ---------------------- دریافت پروفایل با آیدی ---------------------- //
const getProfileById = async (req, res) => {
    try {
        const profile = await (0, doctorProfileService_1.getDoctorProfileById)(req.params.id);
        if (!profile)
            return res.status(404).json({ message: "پروفایل پیدا نشد" });
        res.status(200).json(profile);
    }
    catch (err) {
        res
            .status(500)
            .json({ message: "خطا در دریافت پروفایل", error: err.message });
    }
};
exports.getProfileById = getProfileById;
// ---------------------- بروزرسانی پروفایل ---------------------- //
const updateProfile = async (req, res) => {
    try {
        const updated = await (0, doctorProfileService_1.updateDoctorProfile)(req.params.id, req.body);
        if (!updated)
            return res
                .status(404)
                .json({ message: "پروفایل برای بروزرسانی پیدا نشد" });
        res.status(200).json(updated);
    }
    catch (err) {
        res
            .status(500)
            .json({ message: "خطا در بروزرسانی پروفایل", error: err.message });
    }
};
exports.updateProfile = updateProfile;
// ---------------------- حذف پروفایل ---------------------- //
const deleteProfile = async (req, res) => {
    try {
        const deleted = await (0, doctorProfileService_1.deleteDoctorProfile)(req.params.id);
        if (!deleted)
            return res.status(404).json({ message: "پروفایل برای حذف پیدا نشد" });
        res.status(200).json({ message: "پروفایل با موفقیت حذف شد" });
    }
    catch (err) {
        res.status(500).json({ message: "خطا در حذف پروفایل", error: err.message });
    }
};
exports.deleteProfile = deleteProfile;
// ---------------------- تغییر وضعیت دسترسی ---------------------- //
const changeAvailability = async (req, res) => {
    try {
        const updated = await (0, doctorProfileService_1.toggleAvailability)(req.params.id, req.body.isAvailable);
        if (!updated)
            return res.status(404).json({ message: "پروفایل پیدا نشد" });
        res.status(200).json(updated);
    }
    catch (err) {
        res.status(500).json({ message: "خطا در تغییر وضعیت", error: err.message });
    }
};
exports.changeAvailability = changeAvailability;
// ---------------------- افزودن مدرک جدید ---------------------- //
const uploadDocument = async (req, res) => {
    try {
        const { title, fileUrl } = req.body;
        if (!title || !fileUrl)
            return res.status(400).json({ message: "عنوان و فایل الزامی است" });
        const updated = await (0, doctorProfileService_1.addDocument)(req.params.id, { title, fileUrl });
        if (!updated)
            return res.status(404).json({ message: "پروفایل پیدا نشد" });
        res.status(200).json(updated);
    }
    catch (err) {
        res.status(500).json({ message: "خطا در افزودن مدرک", error: err.message });
    }
};
exports.uploadDocument = uploadDocument;
// ---------------------- ایجاد یا بروزرسانی پروفایل ---------------------- //
const upsertProfile = async (req, res) => {
    try {
        const { error } = doctorProfile_validation_1.createDoctorProfileSchema.validate(req.body);
        if (error)
            return res.status(400).json({ message: error.details[0].message });
        const { nationalId, name } = req.body;
        // جستجو بر اساس nationalId یا name
        const personnel = await Personnel_1.default.findOne({
            $or: [{ nationalId: nationalId?.trim() }, { name: name?.trim() }],
        });
        if (!personnel)
            return res.status(404).json({ message: "پرسنل پیدا نشد" });
        if (personnel.role !== "DOCTOR") {
            return res
                .status(400)
                .json({ message: "فقط پرسنل با نقش پزشک قابل انتخاب است" });
        }
        // بررسی وجود پروفایل دکتر
        const existingProfile = await (0, doctorProfileService_1.getAllDoctorProfiles)().then((profiles) => profiles.find((p) => p.personnelId === personnel._id.toString()));
        let profile;
        if (existingProfile) {
            // اگر پروفایل موجود بود بروزرسانی کن
            profile = await (0, doctorProfileService_1.updateDoctorProfile)(existingProfile._id, req.body);
        }
        else {
            // اگر نبود، بساز
            profile = await (0, doctorProfileService_1.createDoctorProfile)({
                ...req.body,
                personnelId: personnel._id,
            });
        }
        res.status(200).json({ message: "اطلاعات پزشک ذخیره شد", profile });
    }
    catch (err) {
        res
            .status(500)
            .json({ message: "خطا در ذخیره اطلاعات", error: err.message });
    }
};
exports.upsertProfile = upsertProfile;
