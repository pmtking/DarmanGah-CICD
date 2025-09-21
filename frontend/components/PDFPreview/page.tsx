"use client";

interface PDFPreviewProps {
  fileUrl: string;
  onClose: () => void;
}

export default function PDFPreview({ fileUrl, onClose }: PDFPreviewProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      <div className="bg-white rounded-2xl shadow-lg w-11/12 md:w-3/4 lg:w-2/3 h-[80vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-bold">📄 پیش‌نمایش فایل</h2>
          <button
            onClick={onClose}
            className="text-red-500 hover:text-red-700 text-xl"
          >
            ✕
          </button>
        </div>
        <div className="flex-1">
          <iframe
            src={fileUrl}
            className="w-full h-full rounded-b-2xl"
            title="PDF Preview"
          />
        </div>
      </div>
    </div>
  );
}
