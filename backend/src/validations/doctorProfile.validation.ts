import Joi from "joi";

export const createDoctorProfileSchema = Joi.object({
  personnelName: Joi.string().required().label("نام پرسنل"),
  nationalId: Joi.string().required().label("کد ملی"),
  service: Joi.string().required().label("سرویس کلینیک"),
  specialty: Joi.string().required().label("تخصص"),
  specialtyType: Joi.string()
    .valid("پزشک عمومی", "جراح", "داخلی", "اطفال", "پوست", "رادیولوژی", "سایر")
    .required()
    .label("نوع تخصص"),
  licenseNumber: Joi.string().required().label("شماره نظام پزشکی"),
  bio: Joi.string().max(10000).label("بیوگرافی"),
  workingDays: Joi.array()
    .items(
      Joi.string().valid(
        "شنبه",
        "یک‌شنبه",
        "دوشنبه",
        "سه‌شنبه",
        "چهارشنبه",
        "پنج‌شنبه",
        "جمعه"
      )
    )
    .label("روزهای کاری"),
  workingHours: Joi.object({
    شروع: Joi.string().required().label("ساعت شروع"),
    پایان: Joi.string().required().label("ساعت پایان"),
  }).required().label("ساعات کاری"),
  roomNumber: Joi.string().optional().label("شماره اتاق"),
  avatarUrl: Joi.string().uri().optional().label("آواتار"),
  isAvailable: Joi.boolean().optional().label("وضعیت فعال"),
  documents: Joi.array()
    .items(
      Joi.object({
        title: Joi.string().required().label("عنوان مدرک"),
        fileUrl: Joi.string().uri().required().label("لینک فایل"),
      })
    )
    .optional()
    .label("مدارک"),
  serviceGroup: Joi.string().optional().label("گروه سرویس"),
});
