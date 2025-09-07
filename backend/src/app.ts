import express from "express";
import cors from "cors";
import os from "os";
import { mongoConnected } from "./db";
import { dotenvConfig } from "./config/dotenv";
import { router } from "./routes";

// بارگذاری env
dotenvConfig();

// اپلیکیشن
export const app = express();

// میان‌افزارها
app.use(cors({ origin: process.env.ALLOWED_ORIGINS || "*" }));
app.use(express.json());

// مسیرهای API
app.use("/api", router);

// هندل خطاهای عمومی
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("❌ Error:", err.message || err);
  res.status(500).json({ error: "مشکلی در سرور رخ داده است." });
});

// تابع برای گرفتن IPهای سرور
const getServerIPs = () => {
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

// تابع راه‌اندازی
export const startServer = async () => {
  try {
    await mongoConnected();

    const PORT = process.env.PORT || 4000;
    const HOST = process.env.HOST || "0.0.0.0"; // برای سرور لینوکس مهمه
    const serverIPs = getServerIPs();

    app.listen(PORT, HOST, () => {
      console.log("🚀 Server is running:");
      console.log(`   → Local:   http://localhost:${PORT}`);
      if (serverIPs.length > 0) {
        serverIPs.forEach((ip) =>
          console.log(`   → Network: http://${ip}:${PORT}`)
        );
      } else {
        console.log(`   → Network: http://${HOST}:${PORT}`);
      }
    });
  } catch (error) {
    console.error("❌ Server failed to start:", error);
    process.exit(1); // خروج در صورت مشکل جدی
  }
};
