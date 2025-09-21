// ------------------- types --------------------- //
export interface CreateManager {
  username: string;
  password: string;
  accesskey: string;
}

// ----------------- create Manager on developer ----------------- //
import { Developer } from '../models/Developer'; // مسیر مدل رو تنظیم کن
import bcrypt from 'bcrypt';

export async function createManager(params: CreateManager): Promise<{ success: boolean; message: string }> {
  try {
    const { username, password, accesskey } = params;

    // بررسی وجود قبلی
    const existing = await Developer.findOne({ username });
    if (existing) {
      return { success: false, message: 'نام کاربری قبلاً ثبت شده است' };
    }

    // هش کردن رمز عبور
    const hashedPassword = await bcrypt.hash(password, 10);

    // ساخت و ذخیره مدیر
    const newManager = new Developer({
      username,
      password: hashedPassword,
      accesskey,
      isSuperAdmin: true,
    });

    await newManager.save();

    return { success: true, message: 'مدیر با موفقیت ایجاد شد' };
  } catch (error) {
    console.error('خطا در ایجاد مدیر:', error);
    return { success: false, message: 'خطای سرور در ایجاد مدیر' };
  }
}
