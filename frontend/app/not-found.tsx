"use client";

import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

type UserInfo = {
  ip?: string | null;
  city?: string | null;
  region?: string | null;
  country?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  browser?: string;
  os?: string;
  source?: "ipapi" | "webrtc" | "local";
};


export default function NotFoundPage() {
  const [info, setInfo] = useState<UserInfo>({});
  const [loading, setLoading] = useState(true);

  // جمع‌آوری اطلاعات کاربر از UA
  const detectUA = () => {
    const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
    const browserMatch = ua.match(/(firefox|msie|edg|chrome|safari|trident)/i);
    const osMatch = ua.match(/(windows nt|windows|mac os x|macintosh|linux|android|iphone|ipad)/i);
    return {
      browser: browserMatch?.[0] || "ناشناخته",
      os: osMatch?.[0] || "ناشناخته",
    };
  };

  useEffect(() => {
    const ua = detectUA();
    // چون بدون سرور IP واقعی قابل دسترسی نیست، فقط fallback
    setInfo({
      ip: "نامشخص (بدون سرور قابل دریافت نیست)",
      city: null,
      region: null,
      country: null,
      browser: ua.browser,
      os: ua.os,
      source: "local",
    });
    setLoading(false);
  }, []);

  const copyIp = async () => {
    if (!info.ip) return toast.error("آی‌پی موجود نیست");
    try {
      await navigator.clipboard.writeText(info.ip);
      toast.success("IP کپی شد");
    } catch {
      toast.error("کپی ناموفق بود");
    }
  };

  const downloadLog = () => {
    const payload = {
      timestamp: new Date().toISOString(),
      ip: info.ip || null,
      browser: info.browser || null,
      os: info.os || null,
      source: info.source || null,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `access-log-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("لاگ دانلود شد");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b   text-white p-6">
      <Toaster position="top-center" />
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* چپ: پیام 404 */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <div className="text-8xl font-extrabold text-red-500 animate-pulse">404</div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">صفحه مورد نظر یافت نشد</h1>
              <p className="mt-2 text-gray-300 max-w-md">
                ممکن است آدرس اشتباه باشد یا صفحه حذف شده باشد. IP واقعی بدون سرور قابل دریافت نیست.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-[#071939] to-[#08223a] p-5 rounded-xl border border-gray-800 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-200">اقدامات پیشنهادی</h3>
            <ul className="mt-3 text-gray-300 list-disc list-inside space-y-2">
              <li>آدرس را دوباره بررسی کنید.</li>
              <li>با تیم پشتیبانی تماس بگیرید در صورت دسترسی مورد نیاز.</li>
              <li>برای گزارش، اطلاعات بالا را کپی و ارسال کنید.</li>
            </ul>

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={copyIp}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-sm text-white"
              >
                کپی IP
              </button>

              <button
                onClick={() => (window.location.href = "/")}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-white"
              >
                بازگشت به صفحه اصلی
              </button>

              <button
                onClick={downloadLog}
                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-md text-white"
              >
                دانلود لاگ (JSON)
              </button>
            </div>
          </div>
        </div>

        {/* راست: کارت اطلاعات */}
        <div className="bg-[#071226] p-6 rounded-2xl border border-[#11314a] shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-lg">اطلاعات امنیتی کاربر</h4>
            <div className="text-sm text-gray-400">{loading ? "در حال بارگذاری..." : `منبع: ${info.source ?? "نامشخص"}`}</div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-300">آی‌پی</div>
              <div className="font-mono text-sm text-white">{info.ip}</div>
            </div>

            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-300">مرورگر</div>
              <div className="text-sm text-gray-200">{info.browser}</div>
            </div>

            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-300">سیستم‌عامل</div>
              <div className="text-sm text-gray-200">{info.os}</div>
            </div>
          </div>

          <details className="mt-6 p-3 bg-transparent border border-dashed border-gray-800 rounded-md text-sm">
            <summary className="cursor-pointer text-gray-200">جزئیات پیشرفته (لاگ)</summary>
            <div className="mt-3 text-xs text-gray-300">
              <p>تاریخ و زمان: {new Date().toLocaleString()}</p>
              <p>منبع: {info.source ?? "local"}</p>
              <p>IP واقعی بدون سرور قابل دریافت نیست.</p>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}
