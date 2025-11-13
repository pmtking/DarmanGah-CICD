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
const UPLOADS_PATH = path.join(__dirname, "uploads");
app.use("/uploads", express.static(UPLOADS_PATH));

const FILES_PATH = process.env.FILES_PATH || "/home/ubuntu-website/lab";
app.use("/files", express.static(FILES_PATH));

// -------------------- CORS --------------------
const allowedOrigins = [
  "https://drfn.ir",
  "https://www.drfn.ir",
  "https://www.df-neyshabor.ir",
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Origin not allowed by CORS"));
    }
  },
  credentials: true,
}));

const isDev = process.env.NODE_ENV !== "production";

app.use(
  cors({
    origin: (origin, callback) => {
      if (isDev) {
        // در حالت توسعه همه آزاد هستند
        callback(null, true);
      } else {
        // در حالت Production فقط دامنه‌های مشخص
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          console.warn("🚫 Blocked by CORS:", origin);
          callback(new Error("Origin not allowed by CORS"));
        }
      }
    },
    credentials: true,
  })
);

// -------------------- پارسرها --------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// -------------------- مسیرهای API --------------------
app.use("/api", router);

// -------------------- هندل خطا --------------------
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("❌ Server Error:", err.message || err);
  res.status(500).json({ error: "مشکلی در سرور رخ داده است." });
});

// -------------------- نمایش IP --------------------
const getServerIPs = (): string[] => {
  const nets = os.networkInterfaces();
  const results: string[] = [];

  for (const name of Object.keys(nets)) {
    for (const net of nets[name] || []) {
      if (net.family === "IPv4" && !net.internal) results.push(net.address);
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
      const ips = getServerIPs();
      ips.forEach(ip => console.log(`   → Network: http://${ip}:${PORT}`));
      console.log(`   → Allowed Origins: ${isDev ? "ALL (Dev)" : allowedOrigins.join(", ")}`);
    });
  } catch (error) {
    console.error("❌ Server failed to start:", error);
    process.exit(1);
  }
};
