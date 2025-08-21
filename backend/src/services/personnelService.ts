// ---------------- services/personnelService.ts ---------------- //

import Personnel, { IPersonnel } from "../models/Personnel";
import UserAuth from "../models/UserAuth";
import bcrypt from "bcrypt";

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
}

export async function createpersonnel(data: CreatePersonnelWithAuthInput) {
  // بررسی وجود پرسنل با کد ملی
  const existingPersonnel = await Personnel.findOne({ nationalId: data.nationalId });
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
    percentageRate: data.salaryType === "PERCENTAGE" ? data.percentageRate || 0 : 0,
    phone: data.phone || "",
    gender: data.gender || "UNKNOWN",
    hireAt: new Date(),
    isActive: true,
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
