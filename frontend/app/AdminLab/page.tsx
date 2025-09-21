"use client";

import api from "@/libs/axios";
import { useState, useRef } from "react";

export default function UploadLabPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState("");
  const dropRef = useRef<HTMLDivElement>(null);

  const handleFiles = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;
    setFiles((prev) => [...prev, ...Array.from(selectedFiles)]);
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleFiles(e.dataTransfer.files);
    dropRef.current?.classList.remove("border-blue-500");
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dropRef.current?.classList.add("border-blue-500");
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dropRef.current?.classList.remove("border-blue-500");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (files.length === 0) {
      setStatus("❌ لطفاً حداقل یک فایل انتخاب کنید.");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    try {
      const res = await api.post("/api/lab/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
       console.log("Response:", res.data);
    } catch (error) {
      console.error(error);
      setStatus("❌ خطای سرور.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 bg-gradient-to-r">
      <div className="bg-white/30 backdrop-blur-lg shadow-lg rounded-3xl p-8 w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          📤 آپلود جواب آزمایش
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Dropzone */}
          <div
            ref={dropRef}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className="border-4 border-dashed border-gray-300 rounded-2xl p-12 text-center text-gray-100 cursor-pointer transition-colors hover:border-blue-500"
            onClick={() => {
              const fileInput = document.getElementById("fileInput");
              fileInput?.click();
            }}
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
            <div className="flex flex-col gap-2 bg-white/50 p-3 rounded-lg shadow-inner max-h-60 overflow-y-auto">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center border-b last:border-b-0 py-1"
                >
                  <span className="text-gray-700 text-sm truncate">
                    {file.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(index)}
                    className="text-red-500 hover:text-red-700 font-bold"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition font-medium"
          >
            آپلود فایل‌ها
          </button>
        </form>

        {status && (
          <p className="mt-4 text-center text-sm font-medium text-gray-700">
            {status}
          </p>
        )}
      </div>
    </div>
  );
}
