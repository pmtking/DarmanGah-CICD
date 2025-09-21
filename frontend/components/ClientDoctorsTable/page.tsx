"use client";

import { useEffect, useState } from "react";
import api from "@/libs/axios";
import toast from "react-hot-toast";
import DoctorProfileModal from "@/components/DoctorProfileModal/page";

type Doctor = {
  _id: string;
  name: string;
  nationalId: string;
};

export default function ClientDoctorsTable() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedDoctor(null);
    setModalOpen(false);
  };

  const fetchDoctors = async () => {
    try {
      const res = await api.get("/api/doctors/find");
      setDoctors(res.data);
      setFilteredDoctors(res.data);
      toast.success("دریافت اطلاعات پزشکان موفقیت‌آمیز بود");
    } catch (error) {
      toast.error("خطا در دریافت اطلاعات پزشکان");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  // فیلتر براساس سرچ
  useEffect(() => {
    const term = searchTerm.toLowerCase();
    setFilteredDoctors(
      doctors.filter(
        (doc) =>
          doc.name.toLowerCase().includes(term) ||
          doc.nationalId.toLowerCase().includes(term)
      )
    );
  }, [searchTerm, doctors]);

  return (
    <div className="space-y-4 p-6 bg-white/20 backdrop-blur-lg rounded-2xl shadow-lg border border-white/30 -mt-10">
      {/* سرچ */}
      <div className="relative w-full max-w-md mx-auto">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          🔍
        </span>
        <input
          type="text"
          placeholder="جستجو بر اساس نام یا کد ملی"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-3 py-2 rounded-lg border border-white/50 bg-white/30 backdrop-blur-sm text-gray-700 placeholder-gray-200 shadow-sm focus:ring-2 focus:ring-[#071952] focus:border-[#071952] transition-all"
        />
      </div>

      {/* جدول با اسکرول و شیشه‌ای */}
      <div className="overflow-x-auto max-h-[70vh] overflow-y-auto rounded-xl shadow-inner border border-white/20 backdrop-blur-md">
        <table className="min-w-full border-collapse rounded-xl overflow-hidden bg-white/20 backdrop-blur-md shadow-md">
          <thead className="bg-[#071952]/90 text-white sticky top-0">
            <tr>
              <th className="py-3 px-6 text-right font-medium">نام پزشک</th>
              <th className="py-3 px-6 text-right font-medium">کد ملی</th>
              <th className="py-3 px-6 text-right font-medium">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {filteredDoctors.map((doctor) => (
              <tr
                key={doctor._id}
                className="hover:bg-white/10 transition-all cursor-pointer"
              >
                <td className="py-4 px-6 text-right">{doctor.name}</td>
                <td className="py-4 px-6 text-right">{doctor.nationalId}</td>
                <td className="py-4 px-6 text-right">
                  <button
                    onClick={() => openModal(doctor)}
                    className="px-4 py-2 bg-gradient-to-r from-[#071952] to-[#0a2a70] text-white rounded-lg hover:scale-105 transform transition-all shadow-md"
                  >
                    اطلاعات حضور
                  </button>
                </td>
              </tr>
            ))}
            {filteredDoctors.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center py-4 text-gray-300">
                  موردی یافت نشد
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* مودال */}
      {modalOpen && selectedDoctor && (
        <DoctorProfileModal
          isOpen={modalOpen}
          onClose={closeModal}
          doctorName={selectedDoctor.name}
          nationalId={selectedDoctor.nationalId}
          personnelId={selectedDoctor._id}
        />
      )}
    </div>
  );
}
