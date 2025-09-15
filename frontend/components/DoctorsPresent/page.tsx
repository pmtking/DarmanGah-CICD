"use client";

import React, { useEffect, useState } from "react";
import "./style.scss";
import Card from "../Card/page";
import api from "@/libs/axios";

interface Doctor {
  personnelId: string;
  name: string;
  avatarUrl?: string;
  specialty?: string;
  phone?: string;
  status?: "present" | "upcoming" | "finished";
  shiftTime?: string; // ساعت شیفت برای نمایش
}

const DoctorsPresent = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/doctors");

      // زمان فعلی با توجه به تهران
      const now = new Date(
        new Date().toLocaleString("fa-IR", { timeZone: "Asia/Tehran" })
      );
      const nowMinutes = now.getHours() * 60 + now.getMinutes();

      const weekDays = [
        "یک‌شنبه",
        "دوشنبه",
        "سه‌شنبه",
        "چهارشنبه",
        "پنج‌شنبه",
        "جمعه",
        "شنبه",
      ];
      const today = weekDays[now.getDay()];

      const filtered = res.data
        .filter((doc: any) => doc.workingHours?.[today])
        .map((doc: any) => {
          const todayHours = doc.workingHours[today];
          const shiftsSorted = [...todayHours.shifts].sort((a, b) => {
            const [ah, am] = a.start.split(":").map(Number);
            const [bh, bm] = b.start.split(":").map(Number);
            return ah * 60 + am - (bh * 60 + bm);
          });

          let status: "present" | "upcoming" | "finished" = "finished";
          let shiftTime: string | undefined;

          for (let shift of shiftsSorted) {
            const [sh, sm] = shift.start.split(":").map(Number);
            const [eh, em] = shift.end.split(":").map(Number);

            // شیفت طول صفر نادیده گرفته می‌شود
            if (sh === eh && sm === em) continue;

            const start = sh * 60 + sm;
            let end = eh * 60 + em;
            let nowComparable = nowMinutes;

            // مدیریت عبور از نیمه شب
            if (end <= start && nowMinutes < start) nowComparable += 24 * 60;
            if (end <= start) end += 24 * 60;

            if (nowComparable >= start && nowComparable <= end) {
              status = "present";
              shiftTime = `${shift.start} - ${shift.end}`;
              break;
            } else if (nowComparable < start && status === "finished") {
              status = "upcoming";
              shiftTime = `${shift.start} - ${shift.end}`;
              break;
            }
          }

          // اگر هیچ شیفت حاضر یا آینده‌ای نیست، ساعت اولین شیفت را نمایش دهیم
          if (!shiftTime && shiftsSorted.length > 0) {
            const s = shiftsSorted[0];
            shiftTime = `${s.start} - ${s.end}`;
          }

          return {
            personnelId: doc.personnelId,
            name: doc.name,
            avatarUrl: doc.avatarUrl,
            specialty: doc.specialty,
            phone: doc.phone,
            status,
            shiftTime,
          };
        });

      setDoctors(filtered);
    } catch (err) {
      console.error(err);
      setError("خطا در دریافت اطلاعات پزشک‌ها");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  return (
    <div className="flex flex-col justify-start items-center w-full sm:w-[80%] md:w-[50%] lg:w-[35%] xl:w-[24%] bg-amber-50/30 h-auto lg:h-[80vh] rounded-2xl py-5 px-2 mx-auto">
      <div className="header_doctor flex justify-center text-white mb-3">
        <h1 className="text-base sm:text-lg md:text-xl">پزشکان امروز</h1>
      </div>

      <div className="flex flex-col justify-center items-start gap-6 mt-3 w-full px-2 overflow-y-auto lg:overflow-hidden">
        {loading && (
          <p className="text-center text-sm text-gray-600">در حال بارگذاری...</p>
        )}
        {error && (
          <p className="text-center text-red-500 text-sm">{error}</p>
        )}
        {!loading && !error && doctors.length === 0 && (
          <p className="text-center text-gray-500 text-sm">
            هیچ پزشکی برای امروز ثبت نشده است.
          </p>
        )}

        {doctors.map((d) => (
          <Card
            key={d.personnelId}
            doctorId={d.personnelId}
            name={d.name}
            specialty={d.specialty}
            status={d.status}
            nextShift={d.shiftTime} // نمایش ساعت شیفت
          />
        ))}
      </div>
    </div>
  );
};

export default DoctorsPresent;
