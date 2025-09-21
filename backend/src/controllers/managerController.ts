import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { createManager, CreateManager } from '../services/managerService';

// ----------------------------- manager Controller ----------------- //
export async function createManagerController(req: Request, res: Response): Promise<void> {
  const fileMount = 'I:\\';
  const fileName = 'manager.key';
  const filePath = path.join(fileMount, fileName);

  try {
    const { username, password } = req.body;

    // اعتبارسنجی اولیه
    if (!username || !password) {
      res.status(400).json({ success: false, message: 'نام کاربری و رمز عبور الزامی هستند' });
      return;
    }

    // اگر فایل وجود نداشت، کلید جدید بساز و ذخیره کن
    let accesskey: string;
    if (!fs.existsSync(filePath)) {
      accesskey = crypto.randomBytes(32).toString('hex'); // تولید کلید تصادفی
      fs.writeFileSync(filePath, accesskey, 'utf-8');
    } else {
      accesskey = fs.readFileSync(filePath, 'utf-8').trim();
    }

    const params: CreateManager = { username, password, accesskey };
    const result = await createManager(params);

    if (result.success) {
      res.status(201).json({ success: true, message: result.message });
    } else {
      res.status(400).json({ success: false, message: result.message });
    }
  } catch (error) {
    console.error('خطا در کنترلر ایجاد مدیر:', error);
    res.status(500).json({ success: false, message: 'خطای سرور در ایجاد مدیر' });
  }
}
