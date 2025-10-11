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
  const [showCancelledModal, setShowCancelledModal] = useState(false);
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

  // تعداد نوبت هر پزشک
  const appointmentsCountByDoctor: Record<string, number> = {};
  filteredAppointments.forEach((appt) => {
    const doctor = appt.doctorName || "نامشخص";
    appointmentsCountByDoctor[doctor] = (appointmentsCountByDoctor[doctor] || 0) + 1;
  });

  const handleReception = (appt: Appointment) => {
    localStorage.setItem("receptionPatient", JSON.stringify(appt));
    router.push("/reseption");
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? "-" : date.toLocaleDateString("fa-IR");
  };

  const AppointmentCard = ({ appt }: { appt: Appointment }) => (
    <div className="bg-white/10 p-2 rounded-lg shadow-md flex flex-col gap-1 text-xs">
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

        {/* لغو شده‌ها */}
        {filteredAppointments.filter((a) => a.status === "cancelled").length > 0 && (
          <div
            className="flex items-center gap-2 cursor-pointer hover:text-red-700 transition-colors"
            onClick={() => setShowCancelledModal(true)}
          >
            <Trash size={24} className="text-red-600" />
            <span className="text-red-600 font-semibold">
              لغو شده‌ها ({filteredAppointments.filter((a) => a.status === "cancelled").length})
            </span>
          </div>
        )}

        {/* مدال لغو شده‌ها */}
        {showCancelledModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
            <div className="bg-white p-6 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col gap-4">
              <h3 className="text-2xl font-bold text-red-600">نوبت‌های لغو شده</h3>
              <div className="flex flex-col gap-2 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-red-400 scrollbar-thumb-rounded scrollbar-track-gray-200">
                {filteredAppointments
                  .filter((a) => a.status === "cancelled")
                  .map((a) => (
                    <AppointmentCard key={a._id} appt={a} />
                  ))}
              </div>
              <button
                onClick={() => setShowCancelledModal(false)}
                className="mt-4 py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all"
              >
                بستن
              </button>
            </div>
          </div>
        )}

        {/* رزرو شده‌ها */}
        <div className="flex flex-col gap-3">
          <h3 className="font-bold text-lg text-[#071952]">
            نوبت‌های رزرو شده ({filteredAppointments.filter((a) => a.status === "reserved").length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-400 scrollbar-thumb-rounded scrollbar-track-gray-200">
            {(selectedDoctor
              ? filteredAppointments.filter(
                  (a) => a.status === "reserved" && (a.doctorName || "") === selectedDoctor
                )
              : filteredAppointments.filter((a) => a.status === "reserved")
            ).map((a) => (
              <AppointmentCard key={a._id} appt={a} />
            ))}
            {(selectedDoctor
              ? filteredAppointments.filter(
                  (a) => a.status === "reserved" && (a.doctorName || "") === selectedDoctor
                )
              : filteredAppointments.filter((a) => a.status === "reserved")
            ).length === 0 && (
              <p className="text-gray-400 text-sm col-span-full">هیچ نوبت رزرو شده‌ای موجود نیست.</p>
            )}
          </div>
        </div>

        {/* تکمیل شده‌ها */}
        {filteredAppointments.filter((a) => a.status === "completed").length > 0 && (
          <div className="flex flex-col gap-3 mt-6">
            <h3 className="font-bold text-lg text-gray-700">
              نوبت‌های تکمیل شده ({filteredAppointments.filter((a) => a.status === "completed").length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-thumb-rounded scrollbar-track-gray-200">
              {(selectedDoctor
                ? filteredAppointments.filter(
                    (a) => a.status === "completed" && (a.doctorName || "") === selectedDoctor
                  )
                : filteredAppointments.filter((a) => a.status === "completed")
              ).map((a) => (
                <AppointmentCard key={a._id} appt={a} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentsTable;
