"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDoctorProfileSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const weekDays = [
    "شنبه",
    "یک‌شنبه",
    "دوشنبه",
    "سه‌شنبه",
    "چهارشنبه",
    "پنج‌شنبه",
    "جمعه",
];
const specialtyTypes = [
    "پزشک عمومی",
    "جراح عمومی",
    "جراح مغز و اعصاب",
    "جراح قلب",
    "جراح ارتوپد",
    "داخلی",
    "اطفال",
    "پوست و مو",
    "رادیولوژی",
    "مامائی",
    "دندان‌پزشکی",
    "اورولوژی",
    "روان‌شناسی",
    "تغذیه",
    "زنان و زایمان",
    "قلب و عروق",
    "گوارش",
    "فیزیوتراپی",
    "عفونی",
    "بیهوشی",
    "چشم‌پزشکی",
    "گوش و حلق و بینی",
    "طب اورژانس",
    "طب کار",
    "طب فیزیکی و توانبخشی",
    "سایر",
];
exports.createDoctorProfileSchema = joi_1.default.object({
    personnelName: joi_1.default.string().required().label("نام پرسنل"),
    nationalId: joi_1.default.string().required().label("کد ملی"),
    service: joi_1.default.string().required().label("سرویس کلینیک"),
    specialty: joi_1.default.string().allow("").optional().label("زیرتخصص"),
    specialtyType: joi_1.default.string()
        .valid(...specialtyTypes)
        .required()
        .label("نوع تخصص"),
    licenseNumber: joi_1.default.string().required().label("شماره نظام پزشکی"),
    workingDays: joi_1.default.array()
        .items(joi_1.default.string().valid(...weekDays))
        .optional()
        .label("روزهای کاری"),
    workingHours: joi_1.default.object()
        .pattern(joi_1.default.string().valid(...weekDays), joi_1.default.object({
        shifts: joi_1.default.array()
            .items(joi_1.default.object({
            start: joi_1.default.string().required().label("ساعت شروع"),
            end: joi_1.default.string().required().label("ساعت پایان"),
        }))
            .required()
    }))
        .optional()
        .label("ساعات کاری"),
    roomNumber: joi_1.default.string().allow("").optional().label("شماره اتاق"),
    isAvailable: joi_1.default.boolean().optional().label("وضعیت فعال"),
    documents: joi_1.default.array()
        .items(joi_1.default.object({
        title: joi_1.default.string().required().label("عنوان مدرک"),
        fileUrl: joi_1.default.string().uri().required().label("لینک فایل"),
    }))
        .optional()
        .label("مدارک"),
});
