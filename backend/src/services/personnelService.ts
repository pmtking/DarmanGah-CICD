// ---------------- services/personnelService.ts ---------------- //

import Personnel, { IPersonnel } from "../models/Personnel";
import UserAuth from "../models/UserAuth";
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";

export interface CreatePersonnelWithAuthInput {
  name: string;
  nationalId: string;
  role: IPersonnel["role"];
  salaryType: IPersonnel["salaryType"];
  percentageRate?: number;
  phone?: string;
  gender?: IPersonnel["gender"];
  username: string;
  password: string;
  avatar?: string; // مسیر عکس پروفایل
}

// ---------------- Create Personnel ---------------- //
export async function createpersonnel(data: CreatePersonnelWithAuthInput) {
  console.log("------------>> ", data.nationalId);

  // بررسی وجود پرسنل با کد ملی
  const existingPersonnel = await Personnel.findOne({
    nationalId: data.nationalId,
  });
  if (existingPersonnel) {
    throw new Error("پرسنلی با این کد ملی قبلاً ثبت شده است.");
  }

  // بررسی وجود نام کاربری
  const existingUser = await UserAuth.findOne({ username: data.username });
  if (existingUser) {
    throw new Error("نام کاربری قبلاً استفاده شده است.");
  }

  // ساخت پرسنل
  const personnel = new Personnel({
    name: data.name,
    nationalId: data.nationalId,
    role: data.role,
    salaryType: data.salaryType,
    percentageRate:
      data.salaryType === "PERCENTAGE" ? data.percentageRate || 0 : 0,
    phone: data.phone || "",
    gender: data.gender || "OTHER",
    hireAt: new Date(),
    isActive: true,
    avatar: data.avatar || "", // ✅ ذخیره مسیر عکس اگر موجود بود
  });

  await personnel.save();

  // هش کردن رمز عبور
  const hashedPassword = await bcrypt.hash(data.password, 10);

  // ساخت حساب کاربری
  const user = new UserAuth({
    username: data.username,
    password: hashedPassword,
    role: data.role,
    personnel: personnel._id,
  });

  await user.save();

  return { personnel, user };
}

// ---------------- Login ---------------- //
export async function LoginpersonelService(data) {
  const { userName, password } = data;

  // پیدا کردن کاربر و پر کردن اطلاعات پرسنلی
  const auth = await UserAuth.findOne({ username: userName }).populate(
    "personnel"
  );
  if (!auth || !auth.password) {
    throw new Error("کاربر یافت نشد یا اطلاعات ناقص است");
  }

  // اعتبارسنجی رمز عبور
  const isPasswordValid = await bcrypt.compare(password, auth.password);
  if (!isPasswordValid) {
    throw new Error("رمز عبور اشتباه است");
  }

  // بازگرداندن اطلاعات ترکیبی
  return {
    id: auth.personnel._id,
    username: auth.username,
    name: auth.personnel.name,
    role: auth.personnel.role,
  };
}

// ---------------- Update Personnel ---------------- //
export async function updatePersonnel(
  id: string,
  updateData: Partial<IPersonnel> & { avatar?: string }
) {
  const personnel = await Personnel.findById(id);
  if (!personnel) {
    throw new Error("Personnel not found.");
  }

  // اگر آواتار جدید ارسال شده باشد
  if (updateData.avatar) {
    if (personnel.avatar) {
      try {
        fs.unlinkSync(path.resolve(personnel.avatar)); // حذف عکس قبلی
      } catch (err) {
        console.warn("Could not delete old avatar:", err);
      }
    }
    personnel.avatar = updateData.avatar;
  }

  // به‌روزرسانی داده‌های پرسنلی
  Object.assign(personnel, updateData);
  await personnel.save();

  // در صورت نیاز نقش کاربری هم آپدیت شود
  if (updateData.role) {
    await UserAuth.findOneAndUpdate(
      { personnel: id },
      { role: updateData.role }
    );
  }

  return personnel;
}

// ---------------- Delete Personnel ---------------- //
export async function deletePersonnel(id: string) {
  const personnel = await Personnel.findById(id);
  if (!personnel) {
    throw new Error("Personnel not found.");
  }

  // حذف آواتار از سیستم فایل (اگر وجود دارد)
  if (personnel.avatar) {
    try {
      fs.unlinkSync(path.resolve(personnel.avatar));
    } catch (err) {
      console.warn("Could not delete avatar:", err);
    }
  }

  // حذف کاربر مرتبط
  await UserAuth.findOneAndDelete({ personnel: id });

  // حذف پرسنل
  await Personnel.findByIdAndDelete(id);

  return true;
}
