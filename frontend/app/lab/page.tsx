"use client";

import NavBar from "@/components/NavBar/page";
import { useState } from "react";

export default function LabPage() {
  const [codeMelli, setCodeMelli] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!/^\d{10}$/.test(codeMelli)) {
      setResult("❌ کد ملی معتبر نیست. لطفا دوباره وارد کنید.");
      return;
    }

    setResult("✅ جواب آزمایش شما آماده است.");
  };

  return (
    <div className="flex flex-col items-center justify-center w-full py-12">
      <NavBar />
      <h1 className="text-2xl font-bold mb-6 text- mt-20">
        سامانه دریافت جواب آزمایش
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-2xl p-6 w-full max-w-md flex flex-col gap-4"
      >
        <label className="flex flex-col gap-2">
          <span>کد ملی:</span>
          <input
            type="text"
            value={codeMelli}
            onChange={(e) => setCodeMelli(e.target.value)}
            className="border rounded-lg px-3 py-2 text-center"
            placeholder="کد ملی ۱۰ رقمی"
            required
          />
        </label>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
        >
          دریافت جواب
        </button>
      </form>

      {result && (
        <div className="mt-6 w-full max-w-md text-center">
          <div className="bg-green-100 border border-green-300 p-4 rounded-lg">
            <p>{result}</p>
            <div className="flex flex-col gap-2 mt-3">
              <a
                href="/sample-result.pdf"
                download
                className="text-blue-600 underline"
              >
                📄 دانلود جواب آزمایش
              </a>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition"
              >
                👁️ مشاهده آنلاین
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 📌 مدال برای پیش‌نمایش PDF */}
      {isModalOpen && (
        <div className="fixed inset-0   flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg w-11/12 md:w-3/4 lg:w-2/3 h-[80vh] flex flex-col">
            {/* هدر مدال */}
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-bold">📄 پیش‌نمایش جواب آزمایش</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-red-500 hover:text-red-700 text-xl"
              >
                ✕
              </button>
            </div>

            {/* بدنه مدال */}
            <div className="flex-1">
              <iframe
                src="/sample-result.pdf"
                className="w-full h-full rounded-b-2xl"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
