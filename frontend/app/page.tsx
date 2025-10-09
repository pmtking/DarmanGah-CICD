"use client";

import { useState, useEffect } from "react";
import AboutBox from "@/components/AboutBox/page";
import CategoryButtons from "@/components/CategoryButtons/page";
import DoctorsPresent from "@/components/DoctorsPresent/page";
import NavBar from "@/components/NavBar/page";
import Services from "@/components/Services/page";
import toast, { Toaster } from "react-hot-toast";

export default function Home() {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // نمایش مدال بلافاصله بعد از ورود کاربر
    setShowModal(true);
  }, []);

  return (
    <div className="mt-14 w-full min-h-screen relative">
      {/* Toast Notifications */}
      <Toaster position="top-center" />

      {/* Navigation */}
      <NavBar />

      {/* Modal */}
      {/* {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full text-center">
            <h2 className="text-xl font-semibold mb-3 text-gray-800">
              🔧 سایت در حال به‌روزرسانی است
            </h2>
            <p className="text-gray-600 mb-5">
              ممکن است برخی بخش‌ها موقتاً در دسترس نباشند. لطفاً بعداً دوباره مراجعه کنید.
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
            >
              متوجه شدم
            </button>
          </div>
        </div>
      )} */}

      {/* Main Content */}
      <main className="w-full flex flex-col-reverse items-center justify-between gap-25 px-4 sm:px-6 sm:flex-col md:px-12 md:flex-col lg:px-20 py-8 lg:flex-row">
        <Services />
        <AboutBox />
        <DoctorsPresent />
      </main>
    </div>
  );
}
