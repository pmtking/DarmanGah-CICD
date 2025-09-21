"use strict";
// -------------------------- imports ------------------- //
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addDocument = exports.toggleAvailability = exports.deleteDoctorProfile = exports.updateDoctorProfile = exports.getDoctorProfileById = exports.getAllDoctors = exports.getAllDoctorProfiles = exports.createDoctorProfile = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const DoctorProfile_1 = __importDefault(require("../models/DoctorProfile"));
const Personnel_1 = __importDefault(require("../models/Personnel"));
// -------------------------- add profile -------------- //
const createDoctorProfile = async (data) => {
    // پیدا کردن پرسنل بر اساس nationalId یا name
    console.log("Searching Personnel with:", data.nationalId, data.name);
    const personnel = await Personnel_1.default.findOne({
        $or: [{ nationalId: data.nationalId?.trim() }, { name: data.name?.trim() }],
    });
    if (!personnel)
        throw new Error("پرسنل پیدشسشسشسا نشد");
    // ساخت پروفایل با ObjectId واقعی
    const profile = new DoctorProfile_1.default({
        ...data,
        personnel: personnel._id, // اینجا ObjectId ذخیره می‌شود
    });
    return await profile.save();
};
exports.createDoctorProfile = createDoctorProfile;
//  ---------------------- find all profiles --------------- //
const getAllDoctorProfiles = async () => {
    try {
        // مرحله ۱: دریافت پرسنل‌هایی که نقش‌شون پزشک هست و فعال هستند
        const doctors = await Personnel_1.default.find({
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
        const profiles = await Promise.all(doctors.map(async (doctor) => {
            const profile = await DoctorProfile_1.default.findOne({ personnel: doctor._id });
            if (!profile)
                return null;
            // فقط پزشکان فعال در روز جاری را برگردان
            if (!profile.isAvailable || !profile.workingDays.includes(today))
                return null;
            // بررسی زمان پایان
            const [endHour, endMinute] = profile.workingHours.پایان
                .split(":")
                .map(Number);
            const endTimeInMinutes = endHour * 60 + endMinute;
            if (currentTime > endTimeInMinutes)
                return null; // اگر زمان گذشته بود حذف شود
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
        }));
        // حذف null‌ها
        return profiles.filter((p) => p !== null);
    }
    catch (err) {
        console.error("خطا در دریافت پروفایل پزشکان:", err.message);
        throw new Error("خطا در دریافت پروفایل پزشکان");
    }
};
exports.getAllDoctorProfiles = getAllDoctorProfiles;
const getAllDoctors = async (type) => {
    try {
        let filter = {};
        if (type === "general") {
            filter.specialty = "عمومی";
        }
        else if (type === "specialist") {
            filter.specialty = "متخصص";
        }
        const data = await DoctorProfile_1.default.find(filter);
        return data;
    }
    catch (error) {
        console.error("Error in getAllDoctors:", error);
        throw error;
    }
};
exports.getAllDoctors = getAllDoctors;
// --------------------- get profile By Id ------------------ //
const getDoctorProfileById = async (id) => {
    return await DoctorProfile_1.default.findOne({ personnel: id });
};
exports.getDoctorProfileById = getDoctorProfileById;
//  --------------------- update Profile --------------- //
const updateDoctorProfile = async (id, updates) => {
    if (!mongoose_1.default.Types.ObjectId.isValid(id))
        throw new Error("Invalid Id");
    return await DoctorProfile_1.default.findByIdAndUpdate(id, updates, { new: true });
};
exports.updateDoctorProfile = updateDoctorProfile;
//  -------------------------- deleteProfile --------------- //
const deleteDoctorProfile = async (id) => {
    if (!mongoose_1.default.Types.ObjectId.isValid(id))
        throw new Error("Invalid Id");
    return await DoctorProfile_1.default.findByIdAndDelete(id);
};
exports.deleteDoctorProfile = deleteDoctorProfile;
//  ------------------------ toggleAvailability  --------------- //
const toggleAvailability = async (id, isAvailable) => {
    if (!mongoose_1.default.Types.ObjectId.isValid(id))
        throw new Error("Invali Id");
    return await DoctorProfile_1.default.findByIdAndUpdate(id, { isAvailable }, { new: true });
};
exports.toggleAvailability = toggleAvailability;
//  ---------------------------- add document ----------------- //
const addDocument = async (id, document) => {
    if (!mongoose_1.default.Types.ObjectId.isValid(id))
        throw new Error("Invalid ID");
    return await DoctorProfile_1.default.findByIdAndUpdate(id, { $push: { documents: { ...document, uploadedAt: new Date() } } }, { new: true });
};
exports.addDocument = addDocument;
