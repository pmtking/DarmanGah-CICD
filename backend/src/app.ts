import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import os from "os";
import path from "path";
import { mongoConnected } from "./db";
import { dotenvConfig } from "./config/dotenv";
import { router } from "./routes";

// بارگذاری env
dotenvConfig();

// اپلیکیشن
export const app = express();

// مسیر فایل‌ها (static)
const UPLOADS_PATH = process.env.UPLOADS_PATH || path.join(process.cwd(), "uploads");
const FILES_PATH = process.env.FILES_PATH || path.join(process.cwd(), "files");

app.use("/uploads", express.static(UPLOADS_PATH));
app.use("/files", express.static(FILES_PATH));

// CORS
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || ["*"];
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin,Content-Type,Accept,Authorization");
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// پارسر JSON و URL
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// مسیرهای API
app.use("/api", router);

// هندل خطاهای عمومی
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("❌ Error:", err.message || err);
  res.status(500).json({ error: "مشکلی در سرور رخ داده است." });
});

// گرفتن IPهای سرور
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

// تابع راه‌اندازی سرور
export const startServer = async () => {
  try {
    await mongoConnected();

    const PORT = Number(process.env.PORT) || 4000;
    const HOST = process.env.HOST || "0.0.0.0"; // برای دسترسی در شبکه داخلی و سرور

    app.listen(PORT, HOST, () => {
      console.log("🚀 Server is running:");
      console.log(`   → Local:   http://localhost:${PORT}`);

      const serverIPs = getServerIPs();
      if (serverIPs.length > 0) {
        serverIPs.forEach((ip) => console.log(`   → Network: http://${ip}:${PORT}`));
      } else {
        console.log(`   → Network: http://${HOST}:${PORT}`);
      }

      console.log(`   → Frontend allowed origins: ${allowedOrigins.join(", ")}`);
    });
  } catch (error) {
    console.error("❌ Server failed to start:", error);
    process.exit(1);
  }
};
