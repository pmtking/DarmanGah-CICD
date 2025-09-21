"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startServer = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const os_1 = __importDefault(require("os"));
const db_1 = require("./db");
const dotenv_1 = require("./config/dotenv");
const routes_1 = require("./routes");
// بارگذاری env
(0, dotenv_1.dotenvConfig)();
// اپلیکیشن
exports.app = (0, express_1.default)();
exports.app.use("/files", express_1.default.static("/home/ubuntu-website/darmanBot/files/"));
// میان‌افزارها
exports.app.use((0, cors_1.default)({ origin: process.env.ALLOWED_ORIGINS || "*" }));
exports.app.use(express_1.default.json());
// مسیرهای API
exports.app.use("/api", routes_1.router);
// هندل خطاهای عمومی
exports.app.use((err, req, res, next) => {
    console.error("❌ Error:", err.message || err);
    res.status(500).json({ error: "مشکلی در سرور رخ داده است." });
});
// تابع برای گرفتن IPهای سرور
const getServerIPs = () => {
    const nets = os_1.default.networkInterfaces();
    const results = [];
    for (const name of Object.keys(nets)) {
        for (const net of nets[name] || []) {
            if (net.family === "IPv4" && !net.internal) {
                results.push(net.address);
            }
        }
    }
    return results;
};
// تابع راه‌اندازی
const startServer = async () => {
    try {
        await (0, db_1.mongoConnected)();
        const PORT = process.env.PORT || 4000;
        const HOST = process.env.HOST || "0.0.0.0"; // برای سرور لینوکس مهمه
        const serverIPs = getServerIPs();
        exports.app.listen(PORT, HOST, () => {
            console.log("🚀 Server is running:");
            console.log(`   → Local:   http://localhost:${PORT}`);
            if (serverIPs.length > 0) {
                serverIPs.forEach((ip) => console.log(`   → Network: http://${ip}:${PORT}`));
            }
            else {
                console.log(`   → Network: http://${HOST}:${PORT}`);
            }
        });
    }
    catch (error) {
        console.error("❌ Server failed to start:", error);
        process.exit(1); // خروج در صورت مشکل جدی
    }
};
exports.startServer = startServer;
