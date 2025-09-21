"use client";
import { ArrowLeft2, ArrowRight2 } from "iconsax-reactjs";
import React, { useEffect, useRef, useState } from "react";

const banners = [
  {
    title: "🎉 جشنواره تابستانه آغاز شد!",
    description:
      "با تخفیف‌های ویژه روی جدیدترین مدل‌ها، خرید هیجان‌انگیز داشته باش!",
    color: "#EB9200",
  },
  {
    title: "🔥 فروش ویژه آخر هفته!",
    description: "فقط تا پایان جمعه؛ فرصت رو از دست نده!",
    color: "#E63946",
  },
  {
    title: "🚚 ارسال رایگان بالای ۲۰۰ هزار تومان!",
    description: "همین حالا خرید کن و رایگان تحویل بگیر!",
    color: "#457B9D",
  },
];

const PromoBannerSlider = () => {
  const [index, setIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const total = banners.length;

  const scrollToIndex = (idx: number) => {
    const container = containerRef.current;
    if (container) {
      const slideWidth = container.offsetWidth;
      container.scrollTo({
        left: slideWidth * idx,
        behavior: "smooth",
      });
    }
  };

  const handleNext = () => {
    const next = (index + 1) % total;
    setIndex(next);
    scrollToIndex(next);
  };

  const handlePrev = () => {
    const prev = (index - 1 + total) % total;
    setIndex(prev);
    scrollToIndex(prev);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 4000);
    return () => clearInterval(timer);
  }, [index]);

  return (
    <div className="relative w-full overflow-hidden mt-12 rounded-3xl shadow-xl">
      {/* دکمه‌ها */}
      <button
        onClick={handlePrev}
        className="absolute top-1/2 right-3 z-10 -translate-y-1/2 bg-white/10 hover:bg-white/30 text-white rounded-full p-2"
      >
        <ArrowRight2 />
      </button>
      <button
        onClick={handleNext}
        className="absolute top-1/2 left-3 z-10 -translate-y-1/2 bg-white/10 hover:bg-white/30 text-white rounded-full p-2"
      >
        <ArrowLeft2 />
      </button>

      <div
        ref={containerRef}
        className="flex scroll-smooth snap-x snap-mandatory no-scrollbar w-full"
      >
        {banners.map((banner, i) => (
          <div
            key={i}
            className="snap-start flex-shrink-0 w-full min-w-full px-6 py-12 sm:py-16 flex flex-col justify-center items-center text-center"
            style={{ backgroundColor: banner.color }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 text-white drop-shadow">
              {banner.title}
            </h2>
            <p className="text-white/90 text-sm sm:text-base max-w-md leading-relaxed drop-shadow-sm">
              {banner.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PromoBannerSlider;
