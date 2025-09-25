"use client";

import { useState, useRef } from "react";
import api from "@/libs/axios";

interface UploadFile {
  file: File;
  status: "pending" | "uploading" | "success" | "error";
  progress: number;
}

export default function UploadLabPage() {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const dropRef = useRef<HTMLDivElement>(null);

  // اضافه کردن فایل‌ها به لیست
  const handleFiles = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;
    const newFiles = Array.from(selectedFiles).map((file) => ({
      file,
      status: "pending" as const,
      progress: 0,
    }));
    setFiles((prev) => [...prev, ...newFiles]);
  };

  // حذف فایل از لیست
  const handleRemoveFile = (name: string) => {
    setFiles((prev) => prev.filter((f) => f.file.name !== name));
  };

  // مدیریت Drag & Drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
    dropRef.current?.classList.remove("border-blue-500");
  };
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    dropRef.current?.classList.add("border-blue-500");
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    dropRef.current?.classList.remove("border-blue-500");
  };

  // ارسال فایل‌ها به سرور به ترتیب صف
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    for (let i = 0; i < files.length; i++) {
      const currentFile = files[i];

      // ست وضعیت uploading
      setFiles((prev) =>
        prev.map((f) =>
          f.file.name === currentFile.file.name
            ? { ...f, status: "uploading", progress: 0 }
            : f
        )
      );

      const formData = new FormData();
      formData.append("file", currentFile.file);

      try {
        await api.post("/api/lab/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (event) => {
            const percent = Math.round(
              (event.loaded * 100) / (event.total ?? 1)
            );
            setFiles((prev) =>
              prev.map((f) =>
                f.file.name === currentFile.file.name
                  ? { ...f, progress: percent }
                  : f
              )
            );
          },
        });

        // موفقیت
        setFiles((prev) =>
          prev.map((f) =>
            f.file.name === currentFile.file.name
              ? { ...f, status: "success", progress: 100 }
              : f
          )
        );

        // حذف فایل بعد از 1.5 ثانیه
        setTimeout(() => handleRemoveFile(currentFile.file.name), 1500);
      } catch (error) {
        console.error(error);
        setFiles((prev) =>
          prev.map((f) =>
            f.file.name === currentFile.file.name
              ? { ...f, status: "error" }
              : f
          )
        );
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 bg-gradient-to-r ">
      <div className="bg-white/40 backdrop-blur-lg shadow-xl rounded-3xl p-8 w-full max-w-lg border border-white/20">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 text-center">
          📤 آپلود جواب آزمایش
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Dropzone */}
          <div
            ref={dropRef}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => document.getElementById("fileInput")?.click()}
            className="border-4 border-dashed border-gray-300 rounded-2xl p-12 text-center text-gray-700 cursor-pointer transition-colors hover:border-blue-500 bg-white/50"
          >
            کشیدن و رها کردن فایل‌ها اینجا یا کلیک کنید
            <input
              type="file"
              id="fileInput"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
          </div>

          {/* لیست فایل‌ها */}
          {files.length > 0 && (
            <div className="flex flex-col gap-3 bg-white/60 p-4 rounded-lg shadow-inner max-h-60 overflow-y-auto">
              {files.map((f) => (
                <div
                  key={f.file.name}
                  className="flex flex-col gap-1 border rounded-lg p-2 bg-white shadow-sm"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 text-sm truncate">
                      {f.file.name}
                    </span>
                    {f.status === "pending" && (
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(f.file.name)}
                        className="text-red-500 hover:text-red-700 font-bold"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* Progress bar */}
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ease-linear ${
                        f.status === "uploading"
                          ? "bg-blue-500"
                          : f.status === "success"
                          ? "bg-green-500"
                          : f.status === "error"
                          ? "bg-red-500"
                          : "bg-gray-400"
                      }`}
                      style={{ width: `${f.progress}%` }}
                    />
                  </div>

                  {/* درصد آپلود */}
                  <div className="flex justify-end">
                    {f.status === "uploading" && (
                      <span className="text-blue-600 text-xs">
                        در حال آپلود... {f.progress}%
                      </span>
                    )}
                    {f.status === "success" && (
                      <span className="text-green-600 text-xs">✅ آپلود شد</span>
                    )}
                    {f.status === "error" && (
                      <span className="text-red-600 text-xs">❌ خطا</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <button className="bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl transition font-medium shadow-md">
            آپلود فایل‌ها
          </button>
        </form>
      </div>
    </div>
  );
}
