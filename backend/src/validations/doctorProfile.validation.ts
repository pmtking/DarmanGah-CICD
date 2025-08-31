import Joi from "joi";

export const createDoctorProfileSchema = Joi.object({
  personnelName: Joi.string().required(),  // نام پرسنل
  nationalId: Joi.string().required(),     // کد ملی پرسنل
  service: Joi.string().required(),        // سرویس پزشک
  specialty: Joi.string().required(),
  specialtyType: Joi.string()
    .valid("GENERAL","SURGEON","INTERNAL","PEDIATRIC","DERMATOLOGY","RADIOLOGY","OTHER")
    .required(),
  licenseNumber: Joi.string().required(),
  bio: Joi.string().max(10000),
  workingDays: Joi.array().items(
    Joi.string().valid("Saturday","Sunday","Monday","Tuesday","Wednesday","Thursday","Friday")
  ),
  workingHours: Joi.object({
    start: Joi.string().required(),
    end: Joi.string().required(),
  }).required(),
  roomNumber: Joi.string().optional(),
  avatarUrl: Joi.string().uri().optional(),
  isAvailable: Joi.boolean().optional(),
  documents: Joi.array().items(
    Joi.object({
      title: Joi.string().required(),
      fileUrl: Joi.string().uri().required(),
    })
  ).optional(),
  serviceGroup: Joi.string().optional(),
});
