"use client";
import React, { useState } from "react";
import "./style.scss";
import Button from "../Button/page";
import Modal from "../Modal/page";
import ModaleHeader from "../ModaleHeader/page";
import ModaleContect from "../ModaleContect/page";

const AboutBox = () => {
  return (
    <>
      <div className="about_box shadow-2xl">
        <div className="about_box_header">
          <h1 className="text-center text-4xl text-white font-bold text-nowrap">
            درمانگاه فرهنگیان نیشابور
          </h1>
        </div>

        <div className="px-1 md:px-10 mt-4 lg:px-4">
          <p className="text-center text-white leading-relaxed text-md border-b ">
            به <strong>درمانگاه فرهنگیان نیشابور</strong> خوش آمدید! ما مرکزی
            مدرن و مجهز برای ارائه بهترین <strong>خدمات درمانی نیشابور</strong>{" "}
            به فرهنگیان و خانواده‌هایشان هستیم. با تیم متخصص و پزشکان حرفه‌ای،
            امکان <strong>رزرو نوبت درمانگاه نیشابور</strong> به صورت آنلاین
            فراهم شده تا بدون اتلاف وقت به خدمات پزشکی دسترسی داشته باشید. در{" "}
            <strong>کلینیک فرهنگیان نیشابور</strong>، خدمات از مشاوره تخصصی تا
            آزمایشگاه و تصویربرداری با بالاترین کیفیت و رعایت پروتکل‌های بهداشتی
            ارائه می‌شوند. تجربه‌ای سریع و راحت از{" "}
            <strong>نوبت‌دهی آنلاین درمانگاه نیشابور</strong> در انتظار شماست.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 px-4 mt-8">
          <Button
            name="تماس با ما"
            className="btn-yellow-important shadow-2xl"
          />
        </div>
      </div>
    </>
  );
};

export default AboutBox;
