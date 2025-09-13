"use strict";
// ---------------- services/personnelService.ts ---------------- //
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createpersonnel = createpersonnel;
exports.LoginpersonelService = LoginpersonelService;
const Personnel_1 = __importDefault(require("../models/Personnel"));
const UserAuth_1 = __importDefault(require("../models/UserAuth"));
const bcrypt_1 = __importDefault(require("bcrypt"));
async function createpersonnel(data) {
    console.log('------------>> ', data.nationalId);
    // بررسی وجود پرسنل با کد ملی
    const existingPersonnel = await Personnel_1.default.findOne({
        nationalId: data.nationalId,
    });
    console.log('----<<', existingPersonnel);
    if (existingPersonnel) {
        throw new Error("پرسنلی با این کد ملی قبلاً ثبت شده است.");
    }
    // بررسی وجود نام کاربری
    const existingUser = await UserAuth_1.default.findOne({ username: data.username });
    if (existingUser) {
        throw new Error("نام کاربری قبلاً استفاده شده است.");
    }
    // ساخت پرسنل
    const personnel = new Personnel_1.default({
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
    const hashedPassword = await bcrypt_1.default.hash(data.password, 10);
    // ساخت حساب کاربری
    const user = new UserAuth_1.default({
        username: data.username,
        password: hashedPassword,
        role: data.role,
        personnel: personnel._id,
    });
    await user.save();
    return { personnel, user };
}
async function LoginpersonelService(data) {
    const { userName, password } = data;
    // پیدا کردن کاربر و پر کردن اطلاعات پرسنلی
    const auth = await UserAuth_1.default.findOne({ username: userName }).populate('personnel');
    if (!auth || !auth.password) {
        throw new Error('کاربر یافت نشد یا اطلاعات ناقص است');
    }
    // اعتبارسنجی رمز عبور
    const isPasswordValid = await bcrypt_1.default.compare(password, auth.password);
    if (!isPasswordValid) {
        throw new Error('رمز عبور اشتباه است');
    }
    // بازگرداندن اطلاعات ترکیبی
    return {
        id: auth.personnel._id,
        username: auth.username,
        name: auth.personnel.name,
        role: auth.personnel.role,
        // department: auth.personnel.department,
        // سایر فیلدهای مورد نیاز
    };
}
