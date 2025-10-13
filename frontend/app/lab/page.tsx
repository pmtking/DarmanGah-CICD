"use client";

import { useState, useEffect } from "react";
import NavBar from "@/components/NavBar/page";
import api from "@/libs/axios";

const toEnglishDigits = (str: string) =>
  str
    .replace(/[\u06F0-\u06F9]/g, (d) => String(d.charCodeAt(0) - 1776))
    .replace(/[\u0660-\u0669]/g, (d) => String(d.charCodeAt(0) - 1632));

interface LabFile {
  name: string;
  urlPreview: string;
  urlDownload: string;
  dateFolder?: string;
}

export default function LabPage() {
  const [codeMelli, setCodeMelli] = useState("");
  const [files, setFiles] = useState<LabFile[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [previewFile, setPreviewFile] = useState<string | null>(null);
  const [visibleFiles, setVisibleFiles] = useState<number>(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(/Android|iPhone|iPad|iPod/i.test(navigator.userAgent));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const englishCode = toEnglishDigits(codeMelli);

    if (!/^\d{10}$/.test(englishCode)) {
      setStatus("❌ کد ملی معتبر نیست. لطفا دوباره وارد کنید.");
      return;
    }

    try {
      const res = await api.post("/api/lab/get-files", { codeMelli: englishCode });

      const fetchedFiles: LabFile[] = res.data.files.map((f: any) => ({
        name: f.name,
        dateFolder: f.dateFolder,
        urlPreview: `/api/lab/file?path=${encodeURIComponent(f.path)}&mode=inline`,
        urlDownload: `/api/lab/file?path=${encodeURIComponent(f.path)}&mode=download`,
      }));

      setFiles(fetchedFiles);
      setVisibleFiles(0);
      setStatus(
        fetchedFiles.length
          ? `✅ ${fetchedFiles.length} فایل برای کد ملی پیدا شد.`
          : "⚠️ جوابی برای کد ملی مورد نظر موجود نیست."
      );

      fetchedFiles.forEach((_, i) =>
        setTimeout(() => setVisibleFiles((prev) => prev + 1), i * 100)
      );
    } catch (err) {
      console.error(err);
      setStatus("❌ خطا در دریافت فایل‌ها");
      setFiles([]);
    }
  };

  const handleClosePreview = () => setPreviewFile(null);

  const handlePreview = (file: LabFile) => {
    if (isMobile) {
      // موبایل: باز کردن در تب جدید
      window.open(file.urlPreview, "_blank", "noopener,noreferrer");
    } else {
      setPreviewFile(file.urlPreview);
    }
  };

  const handleDownload = async (file: LabFile) => {
    try {
      const response = await fetch(file.urlDownload, { credentials: "include" });
      if (!response.ok) throw new Error("خطا در دانلود فایل");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("❌ دانلود فایل با مشکل مواجه شد.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b flex flex-col items-center justify-center px-4 py-12">
      <NavBar />
      <h1 className="text-3xl md:text-4xl font-extrabold mb-8 text-center text-blue-100 drop-shadow-lg">
        سامانه دریافت جواب آزمایش
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-3xl p-8 w-full max-w-md flex flex-col gap-5 transition-transform hover:scale-105"
      >
        <label className="flex flex-col gap-2">
          <span className="font-semibold text-blue-700">کد ملی:</span>
          <input
            type="text"
            value={codeMelli}
            onChange={(e) => setCodeMelli(toEnglishDigits(e.target.value))}
            className="border border-blue-300 rounded-xl px-4 py-2 text-center focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder="کد ملی ۱۰ رقمی"
            required
          />
        </label>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl text-lg font-medium transition-transform hover:scale-105"
        >
          دریافت جواب
        </button>
      </form>

      {status && (
        <p
          className={`mt-4 text-center font-medium ${
            status.startsWith("❌") ? "text-red-600" : "text-gray-800"
          }`}
        >
          {status}
        </p>
      )}

      {files.length > 0 && (
        <div className="mt-8 w-full max-w-md flex flex-col gap-4">
          {files.map((file, index) => (
            <div
              key={index}
              className={`bg-white shadow-lg rounded-2xl p-4 flex flex-col md:flex-row justify-between items-center gap-3 transform transition-all duration-500 ${
                index < visibleFiles ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
              } hover:shadow-2xl`}
            >
              <span className="truncate font-medium text-blue-900">
                {file.dateFolder ? `[${file.dateFolder}] ` : ""}{file.name}
              </span>
              <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                <button
                  onClick={() => handlePreview(file)}
                  className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-xl text-sm font-semibold transition"
                >
                  👁️ مشاهده
                </button>
                <button
                  onClick={() => handleDownload(file)}
                  className="bg-gray-500 hover:bg-gray-600 text-white py-1 px-3 rounded-xl text-sm font-semibold transition"
                >
                  📄 دانلود
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {previewFile && !isMobile && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-11/12 md:w-3/4 lg:w-2/3 h-[80vh] flex flex-col overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-blue-900">📄 پیش‌نمایش فایل</h2>
              <button
                onClick={handleClosePreview}
                className="text-red-500 hover:text-red-700 text-2xl font-bold"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <iframe
                src={previewFile}
                className="w-full h-full rounded-b-3xl"
                title="PDF Preview"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
