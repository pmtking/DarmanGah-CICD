"use client";

import React, { useEffect, useState } from "react";
import api from "@/libs/axios";
import toast from "react-hot-toast";
import { Trash } from "iconsax-reactjs";
import { useRouter } from "next/navigation";

interface Appointment {
  _id: string;
  fullName: string;
  phoneNumber: string;
  insuranceType: string;
  nationalCode: string;
  appointmentDate: string;
  appointmentTime: string;
  status: "reserved" | "completed" | "cancelled";
  doctorName?: string;
}

const AppointmentsTable = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [search, setSearch] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [selectedAppointments, setSelectedAppointments] = useState<string[]>([]);
  const router = useRouter();

  const fetchAppointments = async () => {
    try {
      const res = await api.get("/api/appointment");
      if (res.data.success) setAppointments(res.data.data);
      else toast.error("هیچ نوبتی موجود نیست");
    } catch (err) {
      console.error(err);
      toast.error("خطا در دریافت نوبت‌ها");
    }
  };

  useEffect(() => {
    fetchAppointments();
    const interval = setInterval(fetchAppointments, 60000);
    return () => clearInterval(interval);
  }, []);

  const filteredAppointments = appointments.filter((appt) => {
    const lower = search.toLowerCase();
    return (
      appt.fullName.toLowerCase().includes(lower) ||
      appt.nationalCode.includes(lower) ||
      (appt.doctorName || "").toLowerCase().includes(lower)
    );
  });

  const appointmentsCountByDoctor: Record<string, number> = {};
  filteredAppointments.forEach((appt) => {
    const doctor = appt.doctorName || "نامشخص";
    appointmentsCountByDoctor[doctor] = (appointmentsCountByDoctor[doctor] || 0) + 1;
  });

  const handleReception = (appt: Appointment) => {
    localStorage.setItem("receptionPatient", JSON.stringify(appt));
    router.push("/reseption");
  };

  const handleBulkDelete = async () => {
    try {
      const res = await api.post("/api/appointment/delete-by-reception", {
        ids: selectedAppointments,
      });
      if (res.data.success) {
        toast.success("نوبت‌ها با موفقیت حذف شدند");
        setAppointments((prev) => prev.filter((a) => !selectedAppointments.includes(a._id)));
        setSelectedAppointments([]);
      } else {
        toast.error(res.data.message || "خطا در حذف نوبت‌ها");
      }
    } catch (err) {
      console.error(err);
      toast.error("خطا در ارتباط با سرور");
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedAppointments((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? "-" : date.toLocaleDateString("fa-IR");
  };

  const AppointmentCard = ({ appt }: { appt: Appointment }) => {
    const isSelected = selectedAppointments.includes(appt._id);
    return (
      <div className="relative bg-white/10 p-2 rounded-lg shadow-md flex flex-col gap-1 text-xs">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => toggleSelect(appt._id)}
          className="absolute top-2 left-2 w-4 h-4"
        />
        <p className="font-semibold truncate">{appt.fullName}</p>
        <p>تلفن: {appt.phoneNumber}</p>
        <p>کد ملی: {appt.nationalCode}</p>
        <p>بیمه: {appt.insuranceType}</p>
        <p>پزشک: {appt.doctorName || "-"}</p>
        <p>تاریخ: {formatDate(appt.appointmentDate)}</p>
        <p>ساعت: {appt.appointmentTime}</p>
        <span
          className={`font-semibold text-xs ${
            appt.status === "reserved"
              ? "text-green-500"
              : appt.status === "completed"
              ? "text-gray-400"
              : "text-red-500"
          }`}
        >
          {appt.status === "reserved"
            ? "رزرو شده"
            : appt.status === "completed"
            ? "اتمام"
            : "لغو شده"}
        </span>
        {appt.status === "reserved" && (
          <button
            onClick={() => handleReception(appt)}
            className="mt-1 bg-blue-600 hover:bg-blue-700 text-white py-1 px-2 rounded text-xs transition-all"
          >
            پذیرش
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="w-full flex gap-6">
      {/* Sidebar پزشکان */}
      <div className="w-64 bg-white border border-gray-200 rounded-2xl shadow-lg p-4 flex flex-col gap-3">
        <h3 className="font-bold text-xl mb-3 text-gray-800">پزشکان و تعداد نوبت</h3>
        {Object.entries(appointmentsCountByDoctor).map(([doctor, count]) => (
          <div
            key={doctor}
            className={`cursor-pointer flex justify-between items-center p-3 rounded-xl transition-all ${
              selectedDoctor === doctor
                ? "bg-blue-100 font-semibold text-blue-700"
                : "hover:bg-gray-100"
            }`}
            onClick={() => setSelectedDoctor(selectedDoctor === doctor ? null : doctor)}
          >
            <span className="truncate">{doctor}</span>
            <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">{count}</span>
          </div>
        ))}
      </div>

      {/* بخش اصلی */}
      <div className="flex-1 flex flex-col gap-6">
        {/* جستجو */}
        <input
          type="text"
          placeholder="جستجو بر اساس نام بیمار، کد ملی یا پزشک"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full mb-4 p-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* دکمه حذف گروهی */}
        {selectedAppointments.length > 0 && (
          <div className="flex items-center gap-3 mb-2">
            <span className="text-sm text-gray-700">
              {selectedAppointments.length} نوبت انتخاب شده
            </span>
            <button
              onClick={handleBulkDelete}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
            >
              حذف نوبت‌ها
            </button>
          </div>
        )}

        {/* لیست نوبت‌ها */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-400 scrollbar-thumb-rounded scrollbar-track-gray-200">
          {(selectedDoctor
            ? filteredAppointments.filter((a) => (a.doctorName || "") === selectedDoctor)
            : filteredAppointments
          ).map((a) => (
            <AppointmentCard key={a._id} appt={a} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AppointmentsTable;
