"use client";
import React, { useState } from "react";
import Button from "../Button/page";

const AboutBox = () => {
  const [data, setData] = useState({
    type: "video",
    title: "درمانگاه فرهنگیان نیشابور",
    content: "به دنیای مدرن سلامت خوش آمدید...",
    mediaUrl: "https://assets.mixkit.co/videos/21685/21685-720.mp4"
  });

  return (
    <div className="w-[36%] relative h-[50vh] rounded-2xl overflow-hidden">

      {/* ویدیو تمام کادر */}
      {data.type === "video" && (
        <video
          autoPlay
          muted
          loop
          className="absolute inset-0 w-full h-full object-cover rounded-2xl"
        >
          <source src={data.mediaUrl} type="video/mp4" />
        </video>
      )}

      {/* لایه تیره برای خوانایی متن */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* متن روی ویدیو */}
      <div className="absolute top-[280px] rounded-2xl z-10 shadow-2xl border backdrop-blur-xs border-gray-600 flex flex-col justify-center items-start text-right px-6 py-7 md:px-16 text-white bg-black/20">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 max-w-2xl ">
          {data.title}
        </h1>

        <p className="text-base md:text-lg mb-8 max-w-2xl leading-loose text-gray-200">
          با استفاده از زیرساخت هوشمند MedLink، نوبت‌دهی و خدمات درمانی را در سریع‌ترین زمان تجربه کنید.
        </p>

       
      </div>
    </div>
  );
};

export default AboutBox;
