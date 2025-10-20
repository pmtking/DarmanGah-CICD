"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startServer = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const os_1 = __importDefault(require("os"));
const path_1 = __importDefault(require("path"));
const db_1 = require("./db");
const dotenv_1 = require("./config/dotenv");
const routes_1 = require("./routes");
// -------------------- بارگذاری env --------------------
(0, dotenv_1.dotenvConfig)();
// -------------------- ساخت اپلیکیشن --------------------
exports.app = (0, express_1.default)();
// -------------------- مسیر فایل‌های استاتیک --------------------
const UPLOADS_PATH = path_1.default.join(__dirname, "uploads");
exports.app.use("/uploads", express_1.default.static(UPLOADS_PATH));
const FILES_PATH = process.env.FILES_PATH || "/home/ubuntu-website/lab";
exports.app.use("/files", express_1.default.static(FILES_PATH));
// -------------------- CORS --------------------
// در حالت توسعه از localhost:3000
// در حالت Production از دامنه drfn.ir
const isProduction = process.env.NODE_ENV === "production";
const allowedOrigins = isProduction
    ? ["https://drfn.ir", "https://www.drfn.ir"]
    : ["http://localhost:3000", "http://127.0.0.1:3000"];
exports.app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            console.warn("🚫 Blocked by CORS:", origin);
            callback(new Error("Origin not allowed by CORS"));
        }
    },
    credentials: true,
}));
// -------------------- پارسرها --------------------
exports.app.use(express_1.default.json());
exports.app.use(express_1.default.urlencoded({ extended: true }));
// -------------------- مسیرهای API --------------------
exports.app.use("/api", routes_1.router);
// -------------------- هندل خطا --------------------
exports.app.use((err, req, res, next) => {
    console.error("❌ Server Error:", err.message || err);
    res.status(500).json({ error: "مشکلی در سرور رخ داده است." });
});
// -------------------- نمایش IP --------------------
const getServerIPs = () => {
    const nets = os_1.default.networkInterfaces();
    const results = [];
    for (const name of Object.keys(nets)) {
        for (const net of nets[name] || []) {
            if (net.family === "IPv4" && !net.internal)
                results.push(net.address);
        }
    }
    return results;
};
// -------------------- راه‌اندازی سرور --------------------
const startServer = async () => {
    try {
        await (0, db_1.mongoConnected)();
        const PORT = Number(process.env.PORT) || 4000;
        const HOST = process.env.HOST || "0.0.0.0";
        exports.app.listen(PORT, HOST, () => {
            console.log("🚀 Server is running:");
            console.log(`   → Local:   http://localhost:${PORT}`);
            const ips = getServerIPs();
            ips.forEach(ip => console.log(`   → Network: http://${ip}:${PORT}`));
            console.log(`   → Allowed Origins: ${allowedOrigins.join(", ")}`);
        });
    }
    catch (error) {
        console.error("❌ Server failed to start:", error);
        process.exit(1);
    }
};
exports.startServer = startServer;
