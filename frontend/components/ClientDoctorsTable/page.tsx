"use client";

import { useEffect, useState } from "react";
import api from "@/libs/axios";
import toast from "react-hot-toast";
import DoctorProfileModal from "@/components/DoctorProfileModal/page";

// 🩺 مدل داده پزشک
type Doctor = {
  personnelId: string;
  name: string;
  nationalId?: string;
  avatarUrl?: string;
  phone?: string;
};

export default function ClientDoctorsTable() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // 📦 دریافت لیست پزشکان
  const fetchDoctors = async () => {
    try {
      const res = await api.get("/api/doctors/find");

      // ✅ اطمینان از داشتن فیلدهای لازم
      const mapped = res.data.map((doc: any) => ({
        personnelId: doc.personnelId,
        name: doc.name || "بدون نام",
        nationalId: doc.nationalId || "",
        avatarUrl: doc.avatarUrl,
        phone: doc.phone,
      }));

      setDoctors(mapped);
      setFilteredDoctors(mapped);
      toast.success("✅ دریافت اطلاعات پزشکان موفقیت‌آمیز بود");
    } catch (error) {
      console.error("Doctor fetch error:", error);
      toast.error("❌ خطا در دریافت اطلاعات پزشکان");
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  // 🔍 فیلتر بر اساس جستجو
  useEffect(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      setFilteredDoctors(doctors);
      return;
    }

    const filtered = doctors.filter(
      (doc) =>
        doc.name.toLowerCase().includes(term) ||
        (doc.nationalId && doc.nationalId.toLowerCase().includes(term))
    );

    setFilteredDoctors(filtered);
  }, [searchTerm, doctors]);

  // 📌 باز کردن مودال با جزئیات پزشک
  const openModal = async (doctor: Doctor) => {
    try {
      if (!doctor.personnelId) {
        toast.error("کد پرسنلی پزشک یافت نشد!");
        return;
      }

      // 📡 درخواست اطلاعات جزئی از API
      const res = await api.get(`/api/doctors/${doctor.personnelId}`);
            console.log(res.data , '------->>');

      const detailedDoctor: Doctor = {
        ...doctor,
        ...res.data,
        nationalId: res.data.nationalId || doctor.nationalId || "",
      };

      setSelectedDoctor(detailedDoctor);
      setModalOpen(true);
      toast.success("✅ اطلاعات پزشک با موفقیت دریافت شد");
    } catch (err) {
      console.error("Doctor detail fetch error:", err);
      toast.error("❌ خطا در دریافت اطلاعات پزشک");
    }
  };

  const closeModal = () => {
    setSelectedDoctor(null);
    setModalOpen(false);
  };

  return (
    <>
      <div className="space-y-6 p-6 bg-white/10 backdrop-blur-lg rounded-3xl shadow-lg border border-white/20 mt-6">
        {/* 🔍 نوار جستجو */}
        <div className="relative w-full max-w-md mx-auto">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            🔍
          </span>
          <input
            type="text"
            placeholder="جستجو بر اساس نام یا کد ملی"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-2xl border border-white/30 bg-white/20 backdrop-blur-sm text-gray-700 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all"
          />
        </div>

        {/* 📋 جدول پزشکان */}
        <div className="overflow-x-auto max-h-[70vh] overflow-y-auto rounded-2xl shadow-inner border border-white/20 backdrop-blur-md">
          <table className="min-w-full border-collapse rounded-2xl overflow-hidden bg-white/20 backdrop-blur-md shadow-md">
            <thead className="bg-gradient-to-r from-blue-800 to-blue-900 text-white sticky top-0">
              <tr>
                <th className="py-3 px-6 text-right font-medium">نام پزشک</th>
                <th className="py-3 px-6 text-right font-medium">کد ملی</th>
                <th className="py-3 px-6 text-right font-medium">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {filteredDoctors.length > 0 ? (
                filteredDoctors.map((doctor) => (
                  <tr
                    key={doctor.personnelId}
                    className="hover:bg-white/10 transition-all cursor-pointer"
                  >
                    <td className="py-4 px-6 text-right">{doctor.name}</td>
                    <td className="py-4 px-6 text-right">
                      {doctor.nationalId || "—"}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => openModal(doctor)}
                        className="px-4 py-2 bg-gradient-to-r from-blue-700 to-blue-900 text-white rounded-xl hover:scale-105 transform transition-all shadow-md"
                      >
                        اطلاعات حضور
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center py-4 text-gray-300">
                    موردی یافت نشد
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🧩 مودال اطلاعات پزشک */}
      {modalOpen && selectedDoctor && (
        <DoctorProfileModal
          isOpen={modalOpen}
          onClose={closeModal}
          doctorName={selectedDoctor.name}
          nationalId={selectedDoctor.nationalId}
          personnelId={selectedDoctor.personnelId}
        />
      )}
    </>
  );
}
