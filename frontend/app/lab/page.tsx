"use client";

import { Metadata } from "next";
import { useState } from "react";



export default function LabPage() {
  const [codeMelli, setCodeMelli] = useState("");
  const [result, setResult] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // اعتبارسنجی ساده (10 رقم بودن کد ملی)
    if (!/^\d{10}$/.test(codeMelli)) {
      setResult("❌ کد ملی معتبر نیست. لطفا دوباره وارد کنید.");
      return;
    }

    // اینجا می‌تونی به API واقعی وصل بشی
    setResult("✅ جواب آزمایش شما آماده است. برای دانلود روی لینک کلیک کنید.");
  };

  return (
    <div className="flex flex-col items-center justify-center w-full py-12">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
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
        <div className="mt-6 bg-gray-100 border border-gray-300 p-4 rounded-lg w-full max-w-md text-center">
          <p>{result}</p>
          {result.startsWith("✅") && (
            <a
              href="/sample-result.pdf"
              download
              className="text-blue-600 underline mt-2 inline-block"
            >
              📄 دانلود جواب آزمایش
            </a>
          )}
        </div>
      )}
    </div>
  );
}
