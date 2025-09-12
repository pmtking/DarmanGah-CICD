"use client";
import React, { useEffect, useState } from "react";
import "./style.scss";
import Card from "../Card/page";
import api from "@/libs/axios";
import Modal from "../Modal/page";

interface Doctor {
  personnelId: string;
  name: string;
  avatarUrl?: string;
  specialty?: string;
  phone?: string;
}

const DoctorsPresent = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [countdown, setCountdown] = useState(7);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/doctors");
      setDoctors(
        res.data.map((doc: any) => ({
          personnelId: doc.personnelId,
          name: doc.name,
          avatarUrl: doc.avatarUrl,
          specialty: doc.specialty,
          phone: doc.phone,
        }))
      );
    } catch (err) {
      console.error(err);
      setError("خطا در دریافت اطلاعات پزشک‌ها");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
    const hours = new Date().getHours();
    if (!(hours >= 19 || hours < 7)) {
      setShowAlert(true);
      setCountdown(7);
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setShowAlert(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, []);

  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  // حرکت عقربه در جهت ساعت: offset برعکس نسبت countdown
  const offset = (countdown / 8) * circumference;

  return (
    <div className="flex flex-col justify-start items-center w-full sm:w-[80%] md:w-[50%] lg:w-[35%] xl:w-[24%] bg-amber-50/30 h-auto lg:h-[80vh] rounded-2xl py-5 px-2 mx-auto">
      <div className="header_doctor flex justify-center text-white mb-3">
        <h1 className="text-base sm:text-lg md:text-xl">
          پزشکان حاضر در درمانگاه
        </h1>
      </div>

      <div className="flex flex-col justify-center items-start gap-6 mt-3 w-full px-2 overflow-y-auto lg:overflow-hidden">
        {loading && (
          <p className="text-center text-sm text-gray-600">
            در حال بارگذاری...
          </p>
        )}
        {error && <p className="text-center text-red-500 text-sm">{error}</p>}
        {!loading && !error && doctors.length === 0 && (
          <p className="text-center text-gray-500 text-sm">
            هیچ پزشکی فعال ثبت نشده است.
          </p>
        )}

        {doctors.map((d) => (
          <Card
            key={d.personnelId}
            doctorId={d.personnelId}
            name={d.name}
            specialty={d.specialty}
          />
        ))}
      </div>

      <Modal isOpen={showAlert} onClose={() => setShowAlert(false)} title="">
        <div className="relative flex flex-col items-center justify-center p-4 gap-4">
          {/* دایره تایمر */}
          <div className="relative w-16 h-16">
            <svg width="64" height="64" className="absolute top-0 left-0">
              {/* Circle background */}
              <circle
                cx="32"
                cy="32"
                r={radius}
                stroke="#e5e7eb"
                strokeWidth="4"
                fill="transparent"
              />
              {/* Progress circle */}
              <circle
                cx="32"
                cy="32"
                r={radius}
                stroke="#3b82f6"
                strokeWidth="4"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - offset} // حرکت عقربه در جهت ساعت
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 1s linear" }}
              />
              {/* عدد وسط معکوس */}
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dy=".3em"
                fontSize="16"
                fill="#111"
              >
                {countdown}
              </text>
            </svg>
          </div>

          <p className="text-md text-gray-800 text-center mt-2">
            نوبت‌دهی در حال حاضر فعال نیست. <br />
            لطفاً بین ساعت ۱۹:۰۰ تا ۷:۰۰ صبح روز بعد مراجعه کنید.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default DoctorsPresent;
