"use client";
import React from "react";
import Image from "next/image";

interface CardType {
  doctorId: string;
  name: string;
  avatarUrl?: string; // مسیر عکس از سرور
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
  const renderSpecialty = () => {
    if (!specialty) return null;
    return specialty === "عمومی" ? "پزشک عمومی" : `متخصص ${specialty}`;
  };

  const renderStatusText = () => {
    if (status === "present") return "حضور دارد";
    if (status === "upcoming" && nextShift)
      return `شروع حضور از ساعت ${nextShift}`;
    if (status === "finished") return "شیفت امروز به پایان رسیده است";
    return null;
  };

  // مسیر کامل عکس
  const finalAvatar =
    avatarUrl && avatarUrl.trim() !== ""
      ? avatarUrl.startsWith("http") // اگر لینک کامل است
        ? avatarUrl
        : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}${
            avatarUrl.startsWith("/") ? "" : "/"
          }${avatarUrl}`
      : "/images/default.png";

  return (
    <div className="flex flex-wrap sm:flex-nowrap justify-start items-center gap-3 bg-white rounded-3xl px-4 py-3 w-full shadow-md">
      <div className="w-16 h-16 flex-shrink-0 relative rounded-full overflow-hidden">
        <Image
          src={finalAvatar}
          alt={name}
          fill
          style={{ objectFit: "cover" }}
          sizes="64px"
          // unoptimized={true} // لازم اگر تصویر از سرور خارجی است و Next.js CDN ندارد
        />
      </div>

      <div className="flex-grow text-sm sm:text-base text-gray-800">
        <p className="font-bold text-gray-900">{name}</p>
        {specialty && (
          <p className="text-xs text-gray-500 mt-1">{renderSpecialty()}</p>
        )}
        {phone && <p className="text-xs text-gray-400 mt-1">تلفن: {phone}</p>}
        {status && (
          <p className="text-xs text-blue-600 mt-2">{renderStatusText()}</p>
        )}
      </div>
    </div>
  );
};

export default Card;
