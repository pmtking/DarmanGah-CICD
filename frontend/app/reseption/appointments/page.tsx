"use client";

import React, { useEffect, useState } from "react";
import api from "@/libs/axios";
import toast from "react-hot-toast";

interface Appointment {
  _id: string;
  fullName: string;
  phoneNumber: string;
  insuranceType: string;
  nationalCode: string;
  doctorId: { fullName: string; specialization: string } | null;
  appointmentDate: string;
  appointmentTime: string;
  status: "reserved" | "completed" | "cancelled";
}

const AppointmentsTable = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/appointment"); // API نوبت‌های امروز
      if (res.data.success) {
        setAppointments(res.data.data);
        setFilteredAppointments(res.data.data);
      } else {
        toast.error("هیچ نوبتی موجود نیست");
      }
    } catch (err) {
      console.error(err);
      toast.error("خطا در دریافت نوبت‌ها");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
    const interval = setInterval(fetchAppointments, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!search) {
      setFilteredAppointments(appointments);
      return;
    }
    const lower = search.toLowerCase();
    setFilteredAppointments(
      appointments.filter(
        (appt) =>
          appt.fullName.toLowerCase().includes(lower) ||
          appt.phoneNumber.includes(lower) ||
          (appt.doctorId?.fullName || "").toLowerCase().includes(lower)
      )
    );
  }, [search, appointments]);

  return (
    <div className="w-full overflow-x-auto bg-white/20 backdrop-blur-md rounded-xl shadow-md p-4">
      <h2 className="text-lg font-semibold text-white mb-4">لیست نوبت‌ها</h2>

      <input
        type="text"
        placeholder="جستجو بر اساس نام بیمار، شماره یا پزشک"
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
              <th className="px-4 py-2 text-left">نام بیمار</th>
              <th className="px-4 py-2 text-left">کد ملی</th>
              <th className="px-4 py-2 text-left">شماره</th>
              <th className="px-4 py-2 text-left">نوع بیمه</th>
              <th className="px-4 py-2 text-left">پزشک</th>
              <th className="px-4 py-2 text-left">تخصص</th>
              <th className="px-4 py-2 text-left">ساعت نوبت</th>
              <th className="px-4 py-2 text-left">وضعیت</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredAppointments.map((appt) => (
              <tr key={appt._id} className="hover:bg-gray-700/30">
                <td className="px-4 py-2">{appt.fullName}</td>
                <td className="px-4 py-2">{appt.nationalCode}</td>
                <td className="px-4 py-2">{appt.phoneNumber}</td>
                <td className="px-4 py-2">{appt.insuranceType}</td>
                <td className="px-4 py-2">{appt.doctorId?.fullName || "-"}</td>
                <td className="px-4 py-2">{appt.doctorId?.specialization || "-"}</td>
                <td className="px-4 py-2">{appt.appointmentTime}</td>
                <td className="px-4 py-2">
                  {appt.status === "reserved" && (
                    <span className="text-green-400 font-semibold">رزرو شده</span>
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
