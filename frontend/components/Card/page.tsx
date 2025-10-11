"use client";
import React from "react";
import Image from "next/image";

interface CardType {
  doctorId: string;
  name?: string; // optional برای اطمینان
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
  // ✅ اصلاح مسیر عکس
  const finalAvatar = avatarUrl
    ? avatarUrl.startsWith("http")
      ? avatarUrl
      : `${process.env.NEXT_PUBLIC_API_URL || "https://api.df-neyshabor.ir"}${
          avatarUrl.startsWith("/") ? "" : "/"
        }${avatarUrl}`
    : "/images/default.png";

  // ✅ نمایش تخصص پزشک
  const renderSpecialty = () => {
    if (!specialty) return "تخصص نامشخص";
    return specialty === "عمومی" ? "پزشک عمومی" : `متخصص ${specialty}`;
  };

  // ✅ نمایش وضعیت شیفت
  const renderStatusText = () => {
    switch (status) {
      case "present":
        return "حضور دارد";
      case "upcoming":
        return nextShift ? `شروع حضور از ساعت ${nextShift}` : "شیفت بعدی ثبت نشده";
      case "finished":
        return "شیفت امروز به پایان رسیده است";
      default:
        return null;
    }
  };

  // ✅ رنگ‌بندی وضعیت شیفت
  const statusColor = () => {
    switch (status) {
      case "present":
        return "text-green-600";
      case "upcoming":
        return "text-blue-600";
      case "finished":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="flex flex-wrap sm:flex-nowrap justify-start items-center gap-3 bg-white rounded-3xl px-4 py-3 w-full shadow-md hover:shadow-lg transition">
      <div className="w-16 h-16 flex-shrink-0 relative rounded-full overflow-hidden border-2 border-gray-200">
        <Image
          src={finalAvatar}
          alt={name || "پزشک"}
          fill
          style={{ objectFit: "cover" }}
          sizes="64px"
        />
      </div>

      <div className="flex-grow text-sm sm:text-base text-gray-800">
        <p className="font-bold text-gray-900">{name || "نام پزشک نامشخص"}</p>
        <p className="text-xs text-gray-500 mt-1">{renderSpecialty()}</p>
        {phone && <p className="text-xs text-gray-400 mt-1">تلفن: {phone}</p>}
        {status && (
          <p className={`text-xs mt-2 font-medium ${statusColor()}`}>
            {renderStatusText()}
          </p>
        )}
      </div>
    </div>
  );
};

export default Card;
