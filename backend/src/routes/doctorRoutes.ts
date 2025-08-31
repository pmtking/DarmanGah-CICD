import express from "express";
import { changeAvailability, createProfile, deleteProfile, getProfileById, getProfiles, updateProfile, uploadDocument } from "../controllers/doctorProfileController";


const router = express.Router();

// ---------------------- ایجاد پروفایل پزشک ---------------------- //
router.post("/add", createProfile);

// ---------------------- دریافت همه پروفایل‌ها ---------------------- //
router.get("/", getProfiles);

// ---------------------- دریافت پروفایل با آیدی ---------------------- //
router.get("/:id", getProfileById);

// ---------------------- بروزرسانی پروفایل پزشک ---------------------- //
router.put("/:id", updateProfile);

// ---------------------- حذف پروفایل پزشک ---------------------- //
router.delete("/:id", deleteProfile);

// ---------------------- تغییر وضعیت فعال بودن پزشک ---------------------- //
router.patch("/:id/availability", changeAvailability);

// ---------------------- افزودن مدرک جدید به پروفایل ---------------------- //
router.post("/:id/document", uploadDocument);

export default router;
