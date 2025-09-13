"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const auth_router_1 = require("../auth/auth.router");
const auth_1 = require("../middlewares/auth");
const superAdminRouter_1 = __importDefault(require("./superAdminRouter"));
const personnelRoutes_1 = __importDefault(require("./personnelRoutes"));
const managerRoutes_1 = __importDefault(require("./managerRoutes"));
const doctorRoutes_1 = __importDefault(require("./doctorRoutes"));
const clinicServiceRoutes_1 = __importDefault(require("./clinicServiceRoutes"));
const appointmentRoutes_1 = __importDefault(require("./appointmentRoutes"));
const ReseptionRouter_1 = __importDefault(require("./ReseptionRouter"));
const labRoutes_1 = __importDefault(require("./labRoutes"));
exports.router = express_1.default.Router();
const fs = require("fs");
const path = "D:/key.txt"; // مسیر فلش (در ویندوز)
const VALID_TOKEN = "f3a9e2c1-7b4d-4d9a-9c2f-8e1b6f9d2a1e";
function checkUSBKey() {
    if (fs.existsSync(path)) {
        const token = fs.readFileSync(path, "utf8").trim();
        if (token === VALID_TOKEN) {
            console.log("✅ دسترسی مجاز: فلش معتبر وصل است");
            return true;
        }
        else {
            console.log("❌ توکن نامعتبر");
        }
    }
    else {
        console.log("❌ فایل کلید یافت نشد");
    }
    return false;
}
// test router
exports.router.get("/test", (req, res) => {
    res.send("test");
});
exports.router.post("/usb-login", (req, res) => {
    if (checkUSBKey()) {
        res.json({ success: true, message: "ورود موفقیت‌آمیز" });
    }
    else {
        res.status(403).json({ success: false, message: "دسترسی ممنوع" });
    }
});
exports.router.get("/me", auth_1.authMiddleware, (req, res) => {
    res.json({ user: req.user });
});
exports.router.use("/auth", auth_router_1.authRouter);
exports.router.use("/v/", superAdminRouter_1.default);
exports.router.use("/v2", managerRoutes_1.default);
exports.router.use("/service", clinicServiceRoutes_1.default);
exports.router.use("/personel/", personnelRoutes_1.default);
exports.router.use("/doctors", doctorRoutes_1.default);
exports.router.use("/appointment", appointmentRoutes_1.default);
exports.router.use("/lab", labRoutes_1.default);
exports.router.use("/reseption", ReseptionRouter_1.default);
