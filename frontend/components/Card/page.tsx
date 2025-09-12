"use client";
import React, { useState } from "react";
import "./style.scss";
import Image from "next/image";
import Button from "../Button/page";
import Modal from "../Modal/page";
import { TickCircle } from "iconsax-reactjs";
import SelectCard from "../SelectCard/page";

interface CardType {
  doctorId: string;
  name: string;
  avatarUrl?: string;
  specialty?: string;
  phone?: string;
}

const Card = ({ doctorId, name, avatarUrl, specialty, phone }: CardType) => {
  const [isOpen, setIsOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);

  // بررسی بازه رزرو: از ساعت 19 تا 7 صبح روز بعد فعال
  const isBookingEnabled = () => {
    const hours = new Date().getHours();
    return hours >= 19 || hours < 7;
  };

  // نمایش تخصص
  const renderSpecialty = () => {
    if (!specialty) return null;
    return specialty === "عمومی" ? "پزشک عمومی" : `متخصص ${specialty}`;
  };

  // وقتی کاربر کلیک کرد
  const handleBookingClick = () => {
    if (!isBookingEnabled()) {
      // باز کردن مودال اطلاع‌رسانی
      setAlertOpen(true);
      setTimeout(() => setAlertOpen(false), 2000); // بعد از 2 ثانیه خودکار بسته شود
      setIsOpen(true); // مودال اصلی رزرو باز شود
    }
  };

  return (
    <>
      <div className="
          flex flex-wrap sm:flex-nowrap justify-start items-center 
          gap-3 bg-white rounded-3xl px-4 py-3 w-full 
          max-w-full overflow-hidden shadow-md
        ">
        {/* تصویر دکتر */}
        <div className="w-16 h-16 flex-shrink-0">
          <Image
            src={avatarUrl || "/images/image 8.png"}
            alt="doctor"
            className="rounded-full object-cover"
            width={64}
            height={64}
          />
        </div>

        {/* اطلاعات دکتر */}
        <div className="flex-grow text-sm sm:text-base text-gray-800">
          <p className="font-bold text-gray-900">{name}</p>
          {specialty && (
            <p className="text-xs text-gray-500 mt-1">
              <span className="font-medium text-gray-700 text-nowrap">
                {renderSpecialty()}
              </span>
            </p>
          )}
          {phone && <p className="text-xs text-gray-400 mt-1">تلفن: {phone}</p>}
        </div>

        {/* دکمه رزرو */}
        <div className="w-full sm:w-auto mt-2 sm:mt-0">
          <Button
            name="رزرو نوبت"
            className={`btn-important w-full sm:w-auto ${!isBookingEnabled() ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={handleBookingClick}
            disabled={!isBookingEnabled()}
          />
        </div>

        {/* مودال اطلاع‌رسانی */}
        {alertOpen && (
          <div className="fixed top-5 right-5 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
            نوبت‌دهی در این ساعات قابل قبول است
          </div>
        )}

        {/* مودال رزرو */}
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="بخش رزرو نوبت"
        >
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-bold">نوبت اینترنتی و مراجعه حضوری</h2>
            <div className="flex flex-col items-center justify-center gap-3 border border-[#071952] p-5 rounded-2xl">
              <div className="flex justify-start items-center gap-3 w-full">
                <TickCircle />
                <p className="text-medium">زودترین زمان نوبت</p>
              </div>
              <div className="w-full">
                <SelectCard doctorId={doctorId} />
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default Card;
