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
      return `شروع حضور از ساعت ${nextShift}`;
    if (status === "finished") return "شیفت امروز به پایان رسیده است";
    return "وضعیت نامشخص";
  };

  const statusColor = () => {
    if (status === "present") return "bg-green-100 text-green-700";
    if (status === "upcoming") return "bg-blue-100 text-blue-700";
    return "bg-red-100 text-red-700";
  };

  return (
    <div className="flex flex-col items-center gap-3 bg-white rounded-2xl p-4 w-full shadow-md hover:shadow-lg transition-shadow duration-300">
      {/* عکس */}
      <div className="w-24 h-24 relative rounded-full overflow-hidden border-2 border-gray-200">
        <Image
          src={finalAvatar}
          alt={displayName}
          fill
          style={{ objectFit: "cover" }}
          sizes="96px"
        />
      </div>

      {/* نام و تخصص */}
      <p className="font-bold text-lg text-gray-900">{displayName}</p>
      <p className="text-gray-500 text-sm">{renderSpecialty()}</p>

      {/* وضعیت */}
      <span
        className={`mt-2 inline-block px-3 py-1 text-sm font-semibold rounded-full ${statusColor()}`}
      >
        {renderStatusText()}
      </span>
    </div>
  );
};

export default Card;
