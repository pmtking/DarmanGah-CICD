import Joi from "joi";

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

export const createDoctorProfileSchema = Joi.object({
  personnelName: Joi.string().required().label("نام پرسنل"),
  nationalId: Joi.string().required().label("کد ملی"),
  service: Joi.string().required().label("سرویس کلینیک"),
  specialty: Joi.string().allow("").optional().label("زیرتخصص"),
  specialtyType: Joi.string()
    .valid(...specialtyTypes)
    .required()
    .label("نوع تخصص"),
  licenseNumber: Joi.string().required().label("شماره نظام پزشکی"),
  workingDays: Joi.array()
    .items(Joi.string().valid(...weekDays))
    .optional()
    .label("روزهای کاری"),
  workingHours: Joi.object()
    .pattern(
      Joi.string().valid(...weekDays),
      Joi.object({
        shifts: Joi.array()
          .items(
            Joi.object({
              start: Joi.string().required().label("ساعت شروع"),
              end: Joi.string().required().label("ساعت پایان"),
            })
          )
          .required()
      })
    )
    .optional()
    .label("ساعات کاری"),
  roomNumber: Joi.string().allow("").optional().label("شماره اتاق"),
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
});
