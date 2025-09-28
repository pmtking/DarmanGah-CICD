"use client";
import React from "react";
import "./style.scss";
import Button from "../Button/page";

const AboutBox = () => {
  return (
    <div className="about_box shadow-2xl bg-gradient-to-r from-blue-700 to-blue-900 rounded-lg p-4 md:p-8 lg:p-12">
      {/* Header */}
      <div className="about_box_header mb-6">
        <h1 className="text-center text-2xl sm:text-3xl md:text-4xl lg:text-2xl text-white font-bold">
          درمانگاه فرهنگیان نیشابور
        </h1>
      </div>

      {/* Content */}
      <div className="px-2 md:px-6 lg:px-10">
        <p className="text-center text-white leading-relaxed text-sm sm:text-base md:text-md lg:text-md border-b border-gray-300 pb-4">
          به <strong>درمانگاه فرهنگیان نیشابور</strong> خوش آمدید! ما مرکزی مدرن و مجهز برای ارائه بهترین{" "}
          <strong>خدمات درمانی نیشابور</strong> به فرهنگیان و خانواده‌هایشان هستیم. با تیم متخصص و پزشکان حرفه‌ای، امکان{" "}
          <strong>رزرو نوبت درمانگاه نیشابور</strong> به صورت آنلاین فراهم شده تا بدون اتلاف وقت به خدمات پزشکی دسترسی داشته باشید. در{" "}
          <strong>کلینیک فرهنگیان نیشابور</strong>، خدمات از مشاوره تخصصی تا آزمایشگاه و تصویربرداری با بالاترین کیفیت و رعایت پروتکل‌های بهداشتی ارائه می‌شوند. تجربه‌ای سریع و راحت از{" "}
          <strong>نوبت‌دهی آنلاین درمانگاه نیشابور</strong> در انتظار شماست.
        </p>
      </div>

      {/* Button */}
      <div className="flex flex-wrap justify-center gap-4 mt-[-5px]">
        <Button
          name="تماس با ما"
          className="btn-yellow-important shadow-2xl px-6 py-2 sm:px-8 sm:py-3 text-sm sm:text-base"
        />
      </div>
    </div>
  );
};

export default AboutBox;
