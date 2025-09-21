"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createManager = createManager;
// ----------------- create Manager on developer ----------------- //
const Developer_1 = require("../models/Developer"); // مسیر مدل رو تنظیم کن
const bcrypt_1 = __importDefault(require("bcrypt"));
async function createManager(params) {
    try {
        const { username, password, accesskey } = params;
        // بررسی وجود قبلی
        const existing = await Developer_1.Developer.findOne({ username });
        if (existing) {
            return { success: false, message: 'نام کاربری قبلاً ثبت شده است' };
        }
        // هش کردن رمز عبور
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        // ساخت و ذخیره مدیر
        const newManager = new Developer_1.Developer({
            username,
            password: hashedPassword,
            accesskey,
            isSuperAdmin: true,
        });
        await newManager.save();
        return { success: true, message: 'مدیر با موفقیت ایجاد شد' };
    }
    catch (error) {
        console.error('خطا در ایجاد مدیر:', error);
        return { success: false, message: 'خطای سرور در ایجاد مدیر' };
    }
}
