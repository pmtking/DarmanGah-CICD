// app/point/page.tsx
"use client";

import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

const PointPage = () => {
  const [typedText, setTypedText] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const fullText = "سلام! آیا از خدمات راضی بودید؟";

  // تایپ انیمیشن
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setTypedText(fullText.slice(0, index + 1));
      index++;
      if (index === fullText.length) clearInterval(interval);
    }, 120);
    return () => clearInterval(interval);
  }, []);

  const submitRating = () => {
    if (!rating) {
      toast.error("لطفا امتیاز را انتخاب کنید");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      toast.success("امتیاز شما ثبت شد ✅");
      setLoading(false);
      setRating(null);
      setComment("");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br  p-4">
      <Toaster position="top-center" />
      <div className="bg-white/30 backdrop-blur-md rounded-2xl shadow-2xl p-6 max-w-md w-full flex flex-col items-center">
        {/* متن تایپ شده */}
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">
          {typedText}
          <span className="blinking-cursor">|</span>
        </h1>

        {/* نمایش فرم بعد از تایپ */}
        {typedText === fullText && (
          <>
            {/* ستاره‌ها */}
            <div className="flex justify-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(null)}
                  className={`text-5xl transition-transform duration-200 ${
                    star <= (hoverRating || rating || 0)
                      ? "text-yellow-400 scale-125 animate-pulse"
                      : "text-gray-300 hover:text-yellow-300"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>

            {/* textarea */}
            <textarea
              placeholder="نظرتان را بنویسید (اختیاری)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full border rounded-lg p-3 mb-4 text-black resize-none focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white/60 backdrop-blur-sm transition"
              rows={4}
            />

            {/* دکمه ارسال */}
            <button
              onClick={submitRating}
              disabled={loading}
              className="w-full bg-blue-600 text-white rounded-lg py-3 font-bold hover:bg-blue-700 active:scale-95 transition-transform"
            >
              {loading ? "در حال ارسال..." : "ثبت امتیاز"}
            </button>
          </>
        )}
      </div>

      <style jsx>{`
        .blinking-cursor {
          display: inline-block;
          width: 2px;
          background-color: black;
          animation: blink 1s step-start infinite;
        }
        @keyframes blink {
          50% {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default PointPage;
