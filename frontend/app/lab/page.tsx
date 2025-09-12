"use client";

import { useState, useEffect } from "react";
import NavBar from "@/components/NavBar/page";
import api from "@/libs/axios";

interface LabFile {
  name: string;
  url: string;
}

export default function LabPage() {
  const [codeMelli, setCodeMelli] = useState("");
  const [files, setFiles] = useState<LabFile[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [previewFile, setPreviewFile] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(/Android|iPhone|iPad|iPod/i.test(navigator.userAgent));
  }, []);

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
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
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

  const handleClosePreview = () => {
    if (previewFile) {
      URL.revokeObjectURL(previewFile);
      setPreviewFile(null);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full py-12 px-4">
      <NavBar />
      <h1 className="text-2xl font-bold mb-6 text-gray-800 mt-20 text-center">
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

      {status && (
        <p
          className={`mt-4 text-center ${
            status.startsWith("❌") ? "text-red-600" : "text-gray-800"
          }`}
        >
          {status}
        </p>
      )}

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

      {/* مدال پیش‌نمایش PDF */}
      {previewFile && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <div className="bg-white rounded-2xl shadow-lg w-11/12 md:w-3/4 lg:w-2/3 h-[80vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-bold">📄 پیش‌نمایش فایل</h2>
              <button
                onClick={handleClosePreview}
                className="text-red-500 hover:text-red-700 text-xl"
              >
                ✕
              </button>
            </div>
            <div className="flex-1">
              {!isMobile ? (
                <iframe
                  src={previewFile}
                  className="w-full h-full rounded-b-2xl"
                  title="PDF Preview"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full gap-4">
                  <p className="text-red-600 text-center">
                    📱 پیش‌نمایش PDF روی موبایل پشتیبانی نمی‌شود.
                  </p>
                  <a
                    href={previewFile}
                    download="file.pdf"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                  >
                    ⬇️ دانلود فایل
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
