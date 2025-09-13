"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createManagerController = createManagerController;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const crypto_1 = __importDefault(require("crypto"));
const managerService_1 = require("../services/managerService");
// ----------------------------- manager Controller ----------------- //
async function createManagerController(req, res) {
    const fileMount = 'I:\\';
    const fileName = 'manager.key';
    const filePath = path_1.default.join(fileMount, fileName);
    try {
        const { username, password } = req.body;
        // اعتبارسنجی اولیه
        if (!username || !password) {
            res.status(400).json({ success: false, message: 'نام کاربری و رمز عبور الزامی هستند' });
            return;
        }
        // اگر فایل وجود نداشت، کلید جدید بساز و ذخیره کن
        let accesskey;
        if (!fs_1.default.existsSync(filePath)) {
            accesskey = crypto_1.default.randomBytes(32).toString('hex'); // تولید کلید تصادفی
            fs_1.default.writeFileSync(filePath, accesskey, 'utf-8');
        }
        else {
            accesskey = fs_1.default.readFileSync(filePath, 'utf-8').trim();
        }
        const params = { username, password, accesskey };
        const result = await (0, managerService_1.createManager)(params);
        if (result.success) {
            res.status(201).json({ success: true, message: result.message });
        }
        else {
            res.status(400).json({ success: false, message: result.message });
        }
    }
    catch (error) {
        console.error('خطا در کنترلر ایجاد مدیر:', error);
        res.status(500).json({ success: false, message: 'خطای سرور در ایجاد مدیر' });
    }
}
