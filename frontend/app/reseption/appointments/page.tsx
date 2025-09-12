"use client";

import React, { useEffect, useState } from "react";
import api from "@/libs/axios";
import toast from "react-hot-toast";

interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  time: string; // ISO string
  status: "active" | "cancelled" | "completed";
}

const AppointmentsTable = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/appointments");
      // فقط نوبت‌های 1 ساعت آینده
      const now = new Date();
      const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
      const upcomingAppointments = res.data.filter((appt: Appointment) => {
        const apptTime = new Date(appt.time);
        return apptTime >= now && apptTime <= oneHourLater;
      });
      setAppointments(upcomingAppointments);
      setFilteredAppointments(upcomingAppointments);
    } catch (err) {
      console.error(err);
      toast.error("خطا در دریافت نوبت‌ها");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
    // آپدیت خودکار هر دقیقه
    const interval = setInterval(fetchAppointments, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // فیلتر جستجو
  useEffect(() => {
    if (!search) {
      setFilteredAppointments(appointments);
      return;
    }
    const lower = search.toLowerCase();
    setFilteredAppointments(
      appointments.filter(
        (appt) =>
          appt.doctorName.toLowerCase().includes(lower) ||
          appt.specialty.toLowerCase().includes(lower)
      )
    );
  }, [search, appointments]);

  return (
    <div className="w-full overflow-x-auto bg-white/20 backdrop-blur-md rounded-xl shadow-md p-4">
      <h2 className="text-lg font-semibold text-white mb-4">لیست نوبت‌ها</h2>

      {/* جستجو */}
      <input
        type="text"
        placeholder="جستجو بر اساس نام پزشک یا تخصص"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-4 p-2 rounded text-black"
      />

      {loading ? (
        <p className="text-white text-center">در حال بارگذاری...</p>
      ) : filteredAppointments.length === 0 ? (
        <p className="text-white text-center">هیچ نوبتی موجود نیست</p>
      ) : (
        <table className="min-w-full divide-y divide-gray-200 text-white">
          <thead>
            <tr className="bg-gray-800/50">
              <th className="px-4 py-2 text-left">نام پزشک</th>
              <th className="px-4 py-2 text-left">تخصص</th>
              <th className="px-4 py-2 text-left">ساعت نوبت</th>
              <th className="px-4 py-2 text-left">وضعیت</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredAppointments.map((appt) => (
              <tr key={appt.id} className="hover:bg-gray-700/30">
                <td className="px-4 py-2">{appt.doctorName}</td>
                <td className="px-4 py-2">{appt.specialty}</td>
                <td className="px-4 py-2">{new Date(appt.time).toLocaleTimeString()}</td>
                <td className="px-4 py-2">
                  {appt.status === "active" && (
                    <span className="text-green-400 font-semibold">فعال</span>
                  )}
                  {appt.status === "cancelled" && (
                    <span className="text-red-400 font-semibold">لغو شده</span>
                  )}
                  {appt.status === "completed" && (
                    <span className="text-gray-400 font-semibold">اتمام</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AppointmentsTable;
