"use client";
import React, { useEffect, useState } from "react";
import "./style.scss";
import Card from "../Card/page";
import api from "@/libs/axios";

interface Doctor {
  personnelId: string;
  doctorName: string;
  avatarUrl?: string;
  specialty?: string;
  phone?: string;
  status?: "present" | "upcoming" | "finished";
  nextShift?: string;
}

const DoctorsPresent: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🧠 اصلاح مسیر آواتار
  const fixAvatarUrl = (url?: string) => {
    if (!url) return "/images/defult.png";
    if (url.startsWith("http://localhost")) return url.replace("http://localhost:4000", "https://api.df-neyshabor.ir");
    if (!url.startsWith("http")) return `https://api.df-neyshabor.ir${url.startsWith("/") ? "" : "/"}${url}`;
    return url;
  };

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/api/doctors");

      const now = new Date();
      const nowMinutes = now.getHours() * 60 + now.getMinutes();
      const weekDays = ["یک‌شنبه","دوشنبه","سه‌شنبه","چهارشنبه","پنج‌شنبه","جمعه","شنبه"];
      const today = weekDays[now.getDay()];

      const filtered: Doctor[] = res.data
        .filter((doc: any) => doc.workingHours?.[today])
        .map((doc: any) => {
          const todayHours = doc.workingHours[today];
          let status: "present" | "upcoming" | "finished" = "finished";
          let nextShift: string | undefined = undefined;
          let nearestUpcomingDelta = Number.POSITIVE_INFINITY;

          todayHours.shifts.forEach((shift: any) => {
            const [sh, sm] = shift.start.split(":").map(Number);
            const [eh, em] = shift.end.split(":").map(Number);

            if (sh === eh && sm === em) return;

            let start = sh * 60 + sm;
            let end = eh * 60 + em;
            let nowComparable = nowMinutes;

            if (end <= start && nowMinutes < start) nowComparable += 24 * 60;
            if (end <= start) end += 24 * 60;

            if (nowComparable >= start && nowComparable <= end) status = "present";
            else if (nowComparable < start && status !== "present") {
              const delta = start - nowComparable;
              if (delta < nearestUpcomingDelta) {
                nearestUpcomingDelta = delta;
                nextShift = shift.start;
                status = "upcoming";
              }
            }
          });

          return {
            personnelId: doc.personnelId,
            doctorName: doc.name, // ← استفاده از doctorName برای نمایش درست
            avatarUrl: fixAvatarUrl(doc.avatarUrl),
            specialty: doc.specialty,
            phone: doc.phone,
            status,
            nextShift,
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

  useEffect(() => { fetchDoctors(); }, []);

  return (
    <div className="flex flex-col justify-start items-center w-full sm:w-[80%] md:w-[50%] lg:w-[35%] xl:w-[24%] bg-amber-50/30 h-auto lg:h-[80vh] rounded-2xl py-5 px-2 mx-auto">
      {/* هدر */}
      <div className="header_doctor flex justify-center text-white mb-3">
        <h1 className="text-base sm:text-lg md:text-xl">پزشکان امروز</h1>
      </div>

      {/* لیست پزشکان با اسکرول */}
      <div className="flex flex-col gap-6 mt-3 w-full px-2 h-full overflow-y-auto scrollbar-hide">
        {loading && <p className="text-center text-sm text-gray-600">در حال بارگذاری...</p>}
        {error && <p className="text-center text-red-500 text-sm">{error}</p>}
        {!loading && !error && doctors.length === 0 && <p className="text-center text-gray-500 text-sm">هیچ پزشکی برای امروز ثبت نشده است.</p>}

        {doctors.map((d) => (
          <Card
            key={d.personnelId}
            doctorId={d.personnelId}
            name={d.doctorName} // ← اصلاح شد
            specialty={d.specialty}
            status={d.status}
            nextShift={d.nextShift}
            avatarUrl={d.avatarUrl} // ← اصلاح شد
          />
        ))}
      </div>
    </div>
  );
};

export default DoctorsPresent;
