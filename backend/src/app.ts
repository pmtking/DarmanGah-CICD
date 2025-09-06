import express from "express";
import cors from "cors";
import fs from "fs";
import { mongoConnected } from "./db";
import { dotenvConfig } from "./config/dotenv";
import { router } from "./routes";

// مسیر فایل توکن (در ویندوز)
const tokenPath = "i:/auth.token";

// ساخت اپلیکیشن
export const app = express();

// میان‌افزارها
app.use(cors());
app.use(express.json());

// بارگذاری تنظیمات محیطی
dotenvConfig();

// مسیرهای API
app.use("/api", router);

// تابع راه‌اندازی سرور
export const startServer = async () => {
  try {
    await mongoConnected();

    const PORT = process.env.PORT || 4000;
 

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server failed to start:", error);
  }
};
