import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import os from "os";
import path from "path";
import { mongoConnected } from "./db";
import { dotenvConfig } from "./config/dotenv";
import { router } from "./routes";

// -------------------- بارگذاری env --------------------
dotenvConfig();

// -------------------- ساخت اپلیکیشن --------------------
export const app = express();

// -------------------- مسیر فایل‌های استاتیک --------------------
// مسیر آپلودها (بر اساس مسیر جدید)
const UPLOADS_PATH = path.join(__dirname, "public", "uploads");
app.use("/uploads", express.static(UPLOADS_PATH));

// مسیر فایل‌های دیگر
const FILES_PATH = process.env.FILES_PATH || path.join(process.cwd(), "files");
app.use("/files", express.static(FILES_PATH));

// -------------------- CORS --------------------
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || ["*"];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Origin not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Origin", "Content-Type", "Accept", "Authorization"],
  })
);

// -------------------- پارسرها --------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// -------------------- مسیرهای API --------------------
app.use("/api", router);

// -------------------- هندل خطاهای عمومی --------------------
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("❌ Server Error:", err.message || err);
  res.status(500).json({ error: "مشکلی در سرور رخ داده است." });
});

// -------------------- تابع کمکی برای نمایش IP --------------------
const getServerIPs = (): string[] => {
  const nets = os.networkInterfaces();
  const results: string[] = [];

  for (const name of Object.keys(nets)) {
    for (const net of nets[name] || []) {
      if (net.family === "IPv4" && !net.internal) {
        results.push(net.address);
      }
    }
  }

  return results;
};

// -------------------- راه‌اندازی سرور --------------------
export const startServer = async () => {
  try {
    await mongoConnected();

    const PORT = Number(process.env.PORT) || 4000;
    const HOST = process.env.HOST || "0.0.0.0";

    app.listen(PORT, HOST, () => {
      console.log("🚀 Server is running:");
      console.log(`   → Local:   http://localhost:${PORT}`);

      const serverIPs = getServerIPs();
      if (serverIPs.length > 0) {
        serverIPs.forEach((ip) =>
          console.log(`   → Network: http://${ip}:${PORT}`)
        );
      } else {
        console.log(`   → Network: http://${HOST}:${PORT}`);
      }

      console.log(`   → Allowed Origins: ${allowedOrigins.join(", ")}`);
      console.log(`   → Uploads Path: ${UPLOADS_PATH}`);
      console.log(`   → Files Path: ${FILES_PATH}`);
    });
  } catch (error) {
    console.error("❌ Server failed to start:", error);
    process.exit(1);
  }
};
