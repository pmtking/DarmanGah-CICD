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
  doctorId: { fullName: string; specialization: string } | null;
  appointmentDate: string;
  appointmentTime: string;
  status: "reserved" | "completed" | "cancelled";
}

const AppointmentsTable = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [search, setSearch] = useState("");
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
    const interval = setInterval(fetchAppointments, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const filteredAppointments = appointments.filter((appt) => {
    const lower = search.toLowerCase();
    return (
      appt.fullName.toLowerCase().includes(lower) ||
      appt.nationalCode.includes(lower) ||
      (appt.doctorId?.fullName || "").toLowerCase().includes(lower)
    );
  });

  const cancelledAppointments = filteredAppointments.filter(a => a.status === "cancelled");
  const activeAppointments = filteredAppointments.filter(a => a.status !== "cancelled");

  const doctorMap: Record<string, Appointment[]> = {};
  activeAppointments.forEach(appt => {
    const doctorName = appt.doctorId?.fullName || "بدون پزشک";
    if (!doctorMap[doctorName]) doctorMap[doctorName] = [];
    doctorMap[doctorName].push(appt);
  });

  const handleReception = (appt: Appointment) => {
    // ذخیره اطلاعات بیمار در localStorage
    localStorage.setItem("receptionPatient", JSON.stringify({
      fullName: appt.fullName,
      nationalId: appt.nationalCode,
      doctor: appt.doctorId?.fullName || "",
      appointmentTime: appt.appointmentTime,
    }));
    router.push("/reseption"); // هدایت به صفحه پذیرش
  };

  return (
    <div className="w-full flex flex-col gap-6">

      {/* جستجو */}
      <input
        type="text"
        placeholder="جستجو بر اساس نام بیمار، کد ملی یا پزشک"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-4 p-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {/* سطل آشغال برای لغو شده‌ها */}
      {cancelledAppointments.length > 0 && (
        <div
          className="flex items-center gap-2 cursor-pointer hover:text-red-700 transition-colors"
          onClick={() => setShowCancelledModal(true)}
        >
          <Trash size={24} className="text-red-600" />
          <span className="text-red-600 font-semibold">لغو شده‌ها ({cancelledAppointments.length})</span>
        </div>
      )}

      {/* مدال لغو شده‌ها */}
      {showCancelledModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
          <div className="bg-white p-6 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col gap-4">
            <h3 className="text-2xl font-bold text-red-600">نوبت‌های لغو شده</h3>
            <div className="flex flex-col gap-2 max-h-96 overflow-y-auto">
              {cancelledAppointments.map(a => (
                <div key={a._id} className="bg-red-50 rounded-md p-3 flex justify-between items-center shadow-sm">
                  <div>
                    <p className="font-medium">{a.fullName}</p>
                    <p className="text-sm text-gray-700">کد ملی: {a.nationalCode}</p>
                    <p className="text-sm text-gray-700">پزشک: {a.doctorId?.fullName || "-"}</p>
                  </div>
                  <p className="text-sm text-gray-700">{a.appointmentTime}</p>
                </div>
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

      {/* نوبت‌ها بر اساس دکتر کارت محور */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(doctorMap).map(([doctor, appts]) => (
          <div key={doctor} className="bg-white/20 backdrop-blur-md rounded-xl shadow-md p-4 flex flex-col gap-2">
            <h3 className="font-bold text-[#071952] mb-2">{doctor} - تعداد نوبت: {appts.length}</h3>
            {appts.map(a => (
              <div key={a._id} className="bg-white/10 p-3 rounded-lg shadow-sm flex flex-col gap-2">
                <p className="font-medium">{a.fullName}</p>
                <p className="text-sm text-gray-500">کد ملی: {a.nationalCode}</p>
                <p className="text-sm text-gray-500">ساعت: {a.appointmentTime}</p>
                <span className={`font-semibold ${a.status === "reserved" ? "text-green-500" : "text-gray-400"}`}>
                  {a.status === "reserved" ? "رزرو شده" : "اتمام"}
                </span>
                {a.status === "reserved" && (
                  <button
                    onClick={() => handleReception(a)}
                    className="mt-2 bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded-lg text-sm transition-all shadow-md hover:shadow-lg"
                  >
                    پذیرش
                  </button>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppointmentsTable;
