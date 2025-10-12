"use client";
import React from "react";
import Image from "next/image";

interface CardType {
  doctorId: string;
  name: string;
  avatarUrl?: string;
  specialty?: string;
  phone?: string;
  status?: "present" | "upcoming" | "finished";
  nextShift?: string;
}

const Card: React.FC<CardType> = ({
  name,
  avatarUrl,
  specialty,
  phone,
  status,
  nextShift,
}) => {
  const displayName = name || "نامشخص";

  // فقط اگر آواتار وجود نداشت از عکس پیش‌فرض استفاده کن
  const finalAvatar =
    avatarUrl && avatarUrl.trim() !== "" ? avatarUrl : "/images/defult.png";

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

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 bg-white rounded-3xl px-4 py-3 w-full shadow-md">
      <div className="w-20 h-20 relative rounded-full overflow-hidden flex-shrink-0">
        <Image
          src={finalAvatar}
          alt={displayName}
          fill
          style={{ objectFit: "cover" }}
          sizes="80px"
        />
      </div>

      <div className="flex-1 text-sm sm:text-base text-gray-800">
        <p className="font-bold text-gray-900 text-md">{displayName}</p>
        <p className="text-gray-500 mt-1">{renderSpecialty()}</p>
        {phone && <p className="text-gray-400 mt-1">تلفن: {phone}</p>}
        <p
          className={`mt-2 ${
            status === "present"
              ? "text-green-600"
              : status === "upcoming"
              ? "text-blue-600"
              : "text-red-500"
          }`}
        >
          {renderStatusText()}
        </p>
      </div>
    </div>
  );
};

export default Card;
