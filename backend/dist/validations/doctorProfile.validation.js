"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDoctorProfileSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createDoctorProfileSchema = joi_1.default.object({
    personnelName: joi_1.default.string().required().label("نام پرسنل"),
    nationalId: joi_1.default.string().required().label("کد ملی"),
    service: joi_1.default.string().required().label("سرویس کلینیک"),
    specialty: joi_1.default.string().required().label("تخصص"),
    specialtyType: joi_1.default.string()
        .valid("پزشک عمومی", "جراح", "داخلی", "اطفال", "پوست", "رادیولوژی", "سایر")
        .required()
        .label("نوع تخصص"),
    licenseNumber: joi_1.default.string().required().label("شماره نظام پزشکی"),
    bio: joi_1.default.string().max(10000).label("بیوگرافی"),
    workingDays: joi_1.default.array()
        .items(joi_1.default.string().valid("شنبه", "یک‌شنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه", "جمعه"))
        .label("روزهای کاری"),
    workingHours: joi_1.default.object({
        شروع: joi_1.default.string().required().label("ساعت شروع"),
        پایان: joi_1.default.string().required().label("ساعت پایان"),
    }).required().label("ساعات کاری"),
    roomNumber: joi_1.default.string().optional().label("شماره اتاق"),
    avatarUrl: joi_1.default.string().uri().optional().label("آواتار"),
    isAvailable: joi_1.default.boolean().optional().label("وضعیت فعال"),
    documents: joi_1.default.array()
        .items(joi_1.default.object({
        title: joi_1.default.string().required().label("عنوان مدرک"),
        fileUrl: joi_1.default.string().uri().required().label("لینک فایل"),
    }))
        .optional()
        .label("مدارک"),
    serviceGroup: joi_1.default.string().optional().label("گروه سرویس"),
});
