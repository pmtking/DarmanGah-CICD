"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import NavBar from "@/components/NavBar/page";
import api from "@/libs/axios";
import PDFPreview from "@/components/PDFPreview/page";

interface LabFile {
  name: string;
  url: string;
}

// ⛔️ فقط در مرورگر لود میشه (SSR غیرفعال)


export default function LabPage() {
  const [codeMelli, setCodeMelli] = useState("");
  const [files, setFiles] = useState<LabFile[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [previewFile, setPreviewFile] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!/^\d{10}$/.test(codeMelli)) {
      setStatus("❌ کد ملی معتبر نیست. لطفا دوباره وارد کنید.");
      return;
    }

    try {
      const res = await api.post("/api/lab/get-files", { codeMelli });

      const fetchedFiles: LabFile[] = res.data.files.map((f: any) => {
        const byteCharacters = atob(f.data);
        const byteNumbers = Array.from(byteCharacters).map((c) =>
          c.charCodeAt(0)
        );
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "application/pdf" });
        const fileUrl = URL.createObjectURL(blob);
        return { name: f.name, url: fileUrl };
      });

      setFiles(fetchedFiles);
      setStatus(
        fetchedFiles.length
          ? `✅ ${fetchedFiles.length} فایل برای کد ملی پیدا شد.`
          : "⚠️ فایلی پیدا نشد."
      );
    } catch (err) {
      console.error(err);
      setStatus("❌ مشکلی در دریافت فایل‌ها رخ داد.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full py-12 px-4">
      <NavBar />
      <h1 className="text-2xl font-bold mb-6 text-gray-800 mt-20 text-center">
        سامانه دریافت جواب آزمایش
      </h1>

      {/* فرم ورود کد ملی */}
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

      {/* وضعیت (سبز/قرمز) */}
      {status && (
        <p
          className={`mt-4 text-center ${
            status.startsWith("❌")
              ? "text-red-600"
              : status.startsWith("⚠️")
              ? "text-yellow-600"
              : "text-green-600"
          }`}
        >
          {status}
        </p>
      )}

      {/* لیست فایل‌ها */}
      {files.length > 0 && (
        <div className="mt-6 w-full max-w-md flex flex-col gap-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="bg-green-100 border border-green-300 p-4 rounded-lg flex justify-between items-center"
            >
              <span className="truncate">{file.name}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPreviewFile(file.url)}
                  className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded-lg text-sm"
                >
                  👁️ مشاهده
                </button>
                <a
                  href={file.url}
                  download={file.name}
                  className="bg-gray-500 hover:bg-gray-600 text-white py-1 px-2 rounded-lg text-sm"
                >
                  📄 دانلود
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* مدال پیش‌نمایش PDF (فقط سمت کلاینت) */}
      {previewFile && (
        <PDFPreview fileUrl={previewFile} onClose={() => setPreviewFile(null)} />
      )}
    </div>
  );
}
