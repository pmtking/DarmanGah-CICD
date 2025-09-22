"use client";

import { useState, useEffect } from "react";

const DrPanelPage = () => {
  const [nationalId, setNationalId] = useState("");
  const [trackingCode, setTrackingCode] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const seconds = now.getSeconds().toString().padStart(2, "0");
      setCurrentTime(`${hours}:${minutes}:${seconds}`);
    };

    updateClock(); // فوراً مقدار اولیه
    const interval = setInterval(updateClock, 1000); // هر ثانیه آپدیت شود

    return () => clearInterval(interval); // پاکسازی هنگام خروج از کامپوننت
  }, []);

  const handleSubmit = () => {
    if (!nationalId) return;
    const code = "TRK-" + Math.floor(100000 + Math.random() * 900000);
    setTrackingCode(code);
    setNationalId("");
  };

  return (
    <div className="flex min-h-[80vh] mt-15">
      {/* Sidebar */}
      <aside className="w-64 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl shadow-lg p-6 flex flex-col justify-between m-4 space-y-6">
        {/* کارت مشخصات پزشک */}
        <div className="bg-white/30 backdrop-blur-md rounded-2xl p-4 shadow-inner text-center">
          <h3 className="text-lg font-bold text-blue-700 mb-2">دکتر محمد طاهری</h3>
          <p className="text-sm text-gray-700 mb-1">تخصص: IT</p>
          <p className="text-sm text-gray-700">ساعت : {currentTime}</p>
        </div>

        {/* آمار */}
        <div className="space-y-3">
          <div className="bg-white/30 backdrop-blur-md rounded-xl p-4 shadow-inner">
            <p className="text-sm text-gray-700">تعداد بیماران</p>
            <p className="text-lg font-bold text-blue-600 text-center">42</p>
          </div>
          <div className="bg-white/30 backdrop-blur-md rounded-xl p-4 shadow-inner">
            <p className="text-sm text-gray-700">ویزیت امروز</p>
            <p className="text-lg font-bold text-green-600 text-center">7</p>
          </div>
          <div className="bg-white/30 backdrop-blur-md rounded-xl p-4 shadow-inner">
            <p className="text-sm text-gray-700">در انتظار</p>
            <p className="text-lg font-bold text-orange-600 text-center">3</p>
          </div>
        </div>

        <div className="text-xs text-gray-400 text-center mt-6">
          © 2025 درمانگاه
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="backdrop-blur-md bg-white/30 shadow-lg rounded-2xl p-8 w-full max-w-md border border-white/40">
          <h1 className="text-2xl font-bold text-gray-700 mb-6 text-center">
            ثبت کد ملی بیمار
          </h1>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="کد ملی بیمار"
              value={nationalId}
              onChange={(e) => setNationalId(e.target.value)}
              className="flex-1 border border-white/50 bg-white/20 rounded-md px-3 py-2 text-center text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={handleSubmit}
              className="bg-blue-600/80 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              ثبت
            </button>
          </div>

          {trackingCode && (
            <div className="mt-6 text-center">
              <p className="text-gray-600">کد رهگیری بیمار:</p>
              <p className="text-lg font-bold text-blue-600">{trackingCode}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DrPanelPage;
