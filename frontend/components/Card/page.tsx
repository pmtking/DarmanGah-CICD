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

const Card = ({ name, avatarUrl, specialty, phone, status, nextShift }: CardType) => {
  const renderSpecialty = () => {
    if (!specialty) return null;
    return specialty === "عمومی" ? "پزشک عمومی" : `متخصص ${specialty}`;
  };

  const renderStatusText = () => {
    if (status === "present") return "حضور دارد";
    if (status === "upcoming" && nextShift) return `شروع حضور از ساعت ${nextShift}`;
    if (status === "finished") return "شیفت امروز به پایان رسیده است";
    return null;
  };

  return (
    <div className="flex flex-wrap sm:flex-nowrap justify-start items-center gap-3 bg-white rounded-3xl px-4 py-3 w-full shadow-md">
      <div className="w-16 h-16 flex-shrink-0">
        <Image src={avatarUrl || "/images/image 8.png"} alt="doctor" className="rounded-full object-cover" width={64} height={64} />
      </div>

      <div className="flex-grow text-sm sm:text-base text-gray-800">
        <p className="font-bold text-gray-900">{name}</p>
        {specialty && <p className="text-xs text-gray-500 mt-1">{renderSpecialty()}</p>}
        {phone && <p className="text-xs text-gray-400 mt-1">تلفن: {phone}</p>}
        <p className="text-xs text-blue-600 mt-2">{renderStatusText()}</p>
      </div>
    </div>
  );
};

export default Card;
