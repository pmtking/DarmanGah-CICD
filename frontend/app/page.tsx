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
      

      {/* Main Content */}
      <main className="w-full flex flex-col-reverse items-center justify-between gap-25 px-4 sm:px-6 sm:flex-col md:px-12 md:flex-col lg:px-20 py-8 lg:flex-row">
        <Services />
        <AboutBox />
        <DoctorsPresent />
      </main>
    </div>
  );
}
