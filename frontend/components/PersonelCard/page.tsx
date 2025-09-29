"use client";

import React from "react";
import Image from "next/image";
import "./style.scss";

interface PersonelCardProps {
  name: string;
  role: string;
  imageUrl?: string; // مسیر عکس پرسنل
  onDelete: () => void;
  onUpdate: () => void;
  onViewDocuments: () => void;
}

const PersonelCard: React.FC<PersonelCardProps> = ({
  name,
  role,
  imageUrl,
  onDelete,
  onUpdate,
  onViewDocuments,
}) => {
  // مسیر کامل تصویر
  const finalImage: string =
    imageUrl && imageUrl.trim() !== ""
      ? `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"
        }${imageUrl}`
      : "/images/defult.png";

  return (
    <div className="personel-card flex items-center gap-4 p-3 bg-white/10 backdrop-blur-md rounded-xl shadow-md">
      {/* تصویر پرسنل */}
      <div className="personel-image w-16 h-16 relative rounded-full overflow-hidden">
        <Image
          src={finalImage}
          alt={name}
          fill
          className="object-cover"
          sizes="64px"
        />
      </div>

      {/* اطلاعات */}
      <div className="personel-info flex-1">
        <h3 className="text-white font-semibold">{name}</h3>
        <p className="text-gray-300 text-sm">{role}</p>
      </div>

      {/* دکمه‌ها */}
      <div className="personel-actions flex gap-2">
        <button
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
          onClick={onDelete}
        >
          🗑 حذف
        </button>
        <button
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          onClick={onUpdate}
        >
          ✏️ ویرایش
        </button>
        <button
          className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
          onClick={onViewDocuments}
        >
          📄 مدارک
        </button>
      </div>
    </div>
  );
};

export default PersonelCard;
