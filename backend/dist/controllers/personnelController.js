"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findPersonel = exports.addPersonnelController = void 0;
exports.loginPersonnelController = loginPersonnelController;
const Personnel_1 = __importDefault(require("../models/Personnel"));
const personnelService_1 = require("../services/personnelService");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const addPersonnelController = async (req, res) => {
    try {
        const personel = await (0, personnelService_1.createpersonnel)(req.body);
        return res.status(201).json({
            success: true,
            messgae: 'پرسنل با موفقیت ایجاد شد',
            data: personel
        });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.addPersonnelController = addPersonnelController;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
async function loginPersonnelController(req, res) {
    try {
        const data = req.body;
        console.log(req.body);
        if (!data.userName || !data.password) {
            return res
                .status(400)
                .json({ message: 'Username and password are required' });
        }
        const user = await (0, personnelService_1.LoginpersonelService)(data);
        // تولید توکن JWT
        const token = jsonwebtoken_1.default.sign({
            id: user.id,
            username: user.username,
            role: user.role,
        }, JWT_SECRET, { expiresIn: '1d' } // اعتبار توکن: 1 روز
        );
        res.status(200).json({
            message: 'Login successful',
            user,
            token,
        });
    }
    catch (error) {
        res.status(401).json({
            message: error.message || 'Login failed',
        });
    }
}
const findPersonel = async (req, res) => {
    const data = await Personnel_1.default.find();
    return res.json({ data });
};
exports.findPersonel = findPersonel;
