"use client";

import React from "react";
import Image from "next/image";
import DrProfile from "@/public/images/dr.png";

interface CardType {
  doctorId: string;
  name: string;
  avatarUrl?: string;
  specialty?: string;
  status?: "present" | "upcoming" | "finished";
  nextShift?: string;
}

interface CardProps extends CardType {
  defaultAvatar: string;
}

const Card: React.FC<CardProps> = ({
  name,
  avatarUrl,
  specialty,
  status,
  nextShift,
  defaultAvatar,
}) => {
  const finalAvatar =
    avatarUrl && avatarUrl.trim() !== ""
      ? avatarUrl
      : defaultAvatar || DrProfile;

  const renderStatus = () => {
    switch (status) {
      case "present":
        return {
          text: "حضور دارد",
          style: "bg-green-400/20 text-green-700",
          ring: "ring-green-400",
          available: true,
        };
      case "upcoming":
        return {
          text: nextShift ? `شروع از ${nextShift}` : "به زودی",
          style: "bg-blue-400/20 text-blue-700",
          ring: "ring-blue-400",
          available: false,
        };
      case "finished":
        return {
          text: "اتمام شیفت",
          style: "bg-red-400/20 text-red-700",
          ring: "ring-red-400",
          available: false,
        };
      default:
        return {
          text: "نامشخص",
          style: "bg-gray-400/20 text-gray-600",
          ring: "ring-gray-300",
          available: false,
        };
    }
  };

  const statusData = renderStatus();

  return (
    <div className="group w-full">
      <div
        className="flex items-center justify-between gap-4 px-4 py-3
        rounded-2xl
        bg-white/20 backdrop-blur-xl
        border-2 border-white/40
        shadow-lg shadow-black/10
        hover:shadow-xl hover:scale-[1.01]
        transition-all duration-300"
      >
        {/* Avatar */}
        <div
          className={`relative w-18 h-18 rounded-full  ring-4 ${statusData.ring} ring-green-200`}
        >
          <Image
            src={DrProfile}
            alt={name}
           
            className="absolute object-cover top-[-18px]"
          />
        </div>

        {/* Info */}
        <div className="flex flex-col flex-1">
          <h3 className="font-semibold text-gray-900 text-sm leading-tight">
            {name}
          </h3>
          <p className="text-xs text-gray-700">
            {specialty || "تخصص نامشخص"}
          </p>
        </div>

        {/* Right Section */}
        <div className="flex flex-col items-end gap-2">
          <span
            className={`px-6 py-2 text-[10px] rounded-xl font-medium ${statusData.style} border border-gray-500`}
          >
            {statusData.text}
          </span>

          <button
            
            className={`px-9 py-2 text-[10px] rounded-lg font-medium transition-all duration-300
            ${
              statusData.available
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-500 "
            }`}
          >
            نوبت
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
