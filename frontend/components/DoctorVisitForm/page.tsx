"use client";
import React, { useEffect, useState } from "react";
import api from "@/libs/axios";
import CardDr from "../CradDr/page";
import toast from "react-hot-toast";

interface Doctor {
  personnelId: string;
  doctorName: string;
  avatarUrl?: string;
  specialty?: string;
  status: "present" | "upcoming" | "finished";
  endShift?: string;
}

const DoctorsPresent: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const fixAvatarUrl = (url?: string) =>
    !url || url.trim() === ""
      ? "/images/default.png"
      : url.startsWith("http")
      ? url
      : `https://api.df-neyshabor.ir${url.startsWith("/") ? "" : "/"}${url}`;

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/api/doctors");
      const now = new Date();
      const nowMinutes = now.getHours() * 60 + now.getMinutes();

      const weekDaysIran = [
        "شنبه",
        "یک‌شنبه",
        "دوشنبه",
        "سه‌شنبه",
        "چهارشنبه",
        "پنج‌شنبه",
        "جمعه",
      ];
      const today = weekDaysIran[(now.getDay() + 6) % 7];

      const doctorsToday: Doctor[] = res.data
        .filter((doc: any) => doc.workingHours?.[today])
        .map((doc: any) => {
          let status: "present" | "upcoming" | "finished" = "finished";
          let endShift: string | undefined;

          doc.workingHours[today].shifts.forEach((shift: any) => {
            const [sh, sm] = shift.start.split(":").map(Number);
            const [eh, em] = shift.end.split(":").map(Number);
            const start = sh * 60 + sm;
            let end = eh * 60 + em;
            let nowComparable = nowMinutes;

            if (end <= start && nowMinutes < start) nowComparable += 24 * 60;
            if (end <= start) end += 24 * 60;

            if (nowComparable >= start && nowComparable <= end) {
              status = "present";
              endShift = shift.end;
            } else if (nowComparable < start) {
              status = "upcoming";
            }
          });

          return {
            personnelId: doc.personnelId,
            doctorName: doc.doctorName || "نامشخص",
            avatarUrl: fixAvatarUrl(doc.avatarUrl),
            specialty: doc.specialty || "تخصص نامشخص",
            status,
            endShift,
          };
        });

      setDoctors(doctorsToday);
      toast.success("لیست پزشکان امروز به‌روزرسانی شد");
    } catch {
      setError("خطا در دریافت اطلاعات پزشک‌ها");
      toast.error("خطا در دریافت اطلاعات پزشک‌ها");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  // فیلتر بر اساس سرچ
  const filteredDoctors = doctors.filter(
    (d) =>
      d.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.specialty &&
        d.specialty.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex flex-col items-center w-full max-w-5xl bg-amber-50/30 rounded-2xl py-5 px-4 mx-auto">
      <h1 className="text-lg font-semibold mb-4 text-gray-800">
        پزشکان امروز در درمانگاه
      </h1>

      {/* سرچ */}
      <input
        type="text"
        placeholder="🔍 جستجوی پزشک یا تخصص..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 mb-6 border rounded-lg text-sm focus:ring focus:ring-blue-300"
      />

      {loading && <p className="text-gray-600">در حال بارگذاری...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && filteredDoctors.length === 0 && (
        <p className="text-gray-500">هیچ پزشکی مطابق جستجو یافت نشد.</p>
      )}

      {/* کارت‌ها */}
      <div className="flex flex-wrap gap-6 justify-center">
        {filteredDoctors.map((d) => (
          <CardDr
            key={d.personnelId}
            name={d.doctorName}
            bg={d.avatarUrl || "/images/default.png"}
            img={d.avatarUrl || "/images/default.png"}
            specialty={`${d.specialty} - ${
              d.status === "present"
                ? "حاضر"
                : d.status === "upcoming"
                ? "شیفت آینده"
                : "تمام‌شده"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default DoctorsPresent;
