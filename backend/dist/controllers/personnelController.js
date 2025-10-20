"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePersonnelController = exports.updatePersonnelController = exports.findPersonnelController = exports.loginPersonnelController = exports.addPersonnelController = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Personnel_1 = __importDefault(require("../models/Personnel"));
const personnelService_1 = require("../services/personnelService");
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
// ================== ایجاد پرسنل ==================
const addPersonnelController = async (req, res) => {
    try {
        const bodyData = req.body;
        // اگر عکس آپلود شده بود (avatar یا photo)
        if (req.file) {
            bodyData.avatar = `/uploads/avatars/${req.file.filename}`;
        }
        if (req.files) {
            const files = req.files;
            if (files.avatar) {
                bodyData.avatar = `/uploads/avatars/${files.avatar[0].filename}`;
            }
            else if (files.photo) {
                bodyData.avatar = `/uploads/avatars/${files.photo[0].filename}`;
            }
        }
        const personnel = await (0, personnelService_1.createpersonnel)(bodyData);
        return res.status(201).json({
            success: true,
            message: "پرسنل با موفقیت ایجاد شد",
            data: personnel,
        });
    }
    catch (err) {
        console.error("Error in addPersonnelController:", err);
        return res.status(500).json({ success: false, message: err.message });
    }
};
exports.addPersonnelController = addPersonnelController;
// ================== ورود پرسنل ==================
const loginPersonnelController = async (req, res) => {
    try {
        const { userName, password } = req.body;
        if (!userName || !password) {
            return res.status(400).json({
                success: false,
                message: "Username and password are required",
            });
        }
        const user = await (0, personnelService_1.LoginpersonelService)({ userName, password });
        if (!user) {
            return res
                .status(401)
                .json({ success: false, message: "Invalid username or password" });
        }
        // تولید توکن JWT
        const token = jsonwebtoken_1.default.sign({
            id: user.id,
            username: user.username || user.name,
            role: user.role,
        }, JWT_SECRET, { expiresIn: "1d" });
        return res.status(200).json({
            success: true,
            message: "Login successful",
            user,
            token,
        });
    }
    catch (err) {
        console.error("Error in loginPersonnelController:", err);
        return res.status(500).json({
            success: false,
            message: err.message || "Login failed",
        });
    }
};
exports.loginPersonnelController = loginPersonnelController;
// ================== لیست پرسنل ==================
const findPersonnelController = async (_req, res) => {
    try {
        const data = await Personnel_1.default.find();
        return res.status(200).json({ success: true, data });
    }
    catch (err) {
        console.error("Error in findPersonnelController:", err);
        return res.status(500).json({ success: false, message: err.message });
    }
};
exports.findPersonnelController = findPersonnelController;
// ================== به‌روزرسانی پرسنل ==================
const updatePersonnelController = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        // اگر عکس جدید آپلود شده بود (avatar یا photo)
        if (req.file) {
            updateData.avatar = `/uploads/avatars/${req.file.filename}`;
        }
        if (req.files) {
            const files = req.files;
            if (files.avatar) {
                updateData.avatar = `/uploads/avatars/${files.avatar[0].filename}`;
            }
            else if (files.photo) {
                updateData.avatar = `/uploads/avatars/${files.photo[0].filename}`;
            }
        }
        const updatedPersonnel = await (0, personnelService_1.updatePersonnel)(id, updateData);
        return res.status(200).json({
            success: true,
            message: "پرسنل با موفقیت به‌روزرسانی شد",
            data: updatedPersonnel,
        });
    }
    catch (err) {
        console.error("Error in updatePersonnelController:", err);
        if (err.message === "Personnel not found.") {
            return res.status(404).json({ success: false, message: err.message });
        }
        return res.status(400).json({ success: false, message: err.message });
    }
};
exports.updatePersonnelController = updatePersonnelController;
// ================== حذف پرسنل ==================
const deletePersonnelController = async (req, res) => {
    try {
        const { id } = req.params;
        await (0, personnelService_1.deletePersonnel)(id);
        return res.status(200).json({
            success: true,
            message: "پرسنل با موفقیت حذف شد",
        });
    }
    catch (err) {
        console.error("Error in deletePersonnelController:", err);
        if (err.message === "Personnel not found.") {
            return res.status(404).json({ success: false, message: err.message });
        }
        return res.status(400).json({ success: false, message: err.message });
    }
};
exports.deletePersonnelController = deletePersonnelController;
