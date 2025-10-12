"use client";
import React from "react";
import Image from "next/image";

interface CardType {
  doctorId: string;
  name: string;
  avatarUrl?: string;
  specialty?: string;
  status?: "present" | "upcoming" | "finished";
  nextShift?: string;
}

interface CardProps extends CardType {
  defaultAvatar: string; // مسیر عکس پیش‌فرض
}

const Card: React.FC<CardProps> = ({
  name,
  avatarUrl,
  specialty,
  status,
  nextShift,
  defaultAvatar,
}) => {
  const displayName = name || "نامشخص";

  // اگر عکس نبود، عکس پیش‌فرض استفاده شود
  const finalAvatar =
    avatarUrl && avatarUrl.trim() !== "" ? avatarUrl : defaultAvatar;

  const renderSpecialty = () => {
    if (!specialty) return "تخصص نامشخص";
    return specialty === "عمومی" ? "پزشک عمومی" : `متخصص ${specialty}`;
  };

  const renderStatusText = () => {
    if (status === "present") return "حضور دارد";
    if (status === "upcoming" && nextShift)
      return `شروع از ساعت ${nextShift}`;
    if (status === "finished") return "شیفت به پایان رسیده";
    return "وضعیت نامشخص";
  };

  const statusColor = () => {
    if (status === "present") return "bg-green-100 text-green-700";
    if (status === "upcoming") return "bg-blue-100 text-blue-700";
    return "bg-red-100 text-red-700";
  };

  return (
    <div className="flex flex-col items-center gap-2 bg-white rounded-xl p-3 w-40 shadow-md hover:shadow-lg transition-shadow duration-200">
      {/* عکس */}
      <div className="w-16 h-16 relative rounded-full overflow-hidden border border-gray-200">
        <Image
          src={finalAvatar}
          alt={displayName}
          fill
          style={{ objectFit: "cover" }}
          sizes="64px"
        />
      </div>

      {/* نام و تخصص */}
      <p className="font-semibold text-sm text-gray-900 text-center truncate">{displayName}</p>
      <p className="text-gray-500 text-xs text-center truncate">{renderSpecialty()}</p>

      {/* وضعیت */}
      <span
        className={`mt-1 inline-block px-2 py-0.5 text-xs font-medium rounded-full ${statusColor()}`}
      >
        {renderStatusText()}
      </span>
    </div>
  );
};

export default Card;
