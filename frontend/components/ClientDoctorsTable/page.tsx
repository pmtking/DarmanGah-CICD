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
      toast.success("دریافت اطلاعات پزشکان موفقیت‌آمیز بود");
    } catch (error) {
      toast.error("خطا در دریافت اطلاعات پزشکان");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDoctors();

  }, []);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border rounded-2xl overflow-hidden backdrop-blur-md bg-white/30 shadow-lg">
        <thead style={{ backgroundColor: "#071952" }} className="text-white">
          <tr>
            <th className="py-3 px-6 text-right">نام پزشک</th>
            <th className="py-3 px-6 text-right">کد ملی</th>
            <th className="py-3 px-6 text-right">عملیات</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((doctor) => (
            <tr key={doctor._id} className="hover:bg-white/20 transition">
              <td className="py-4 px-6 text-right">{doctor.name}</td>
              <td className="py-4 px-6 text-right">{doctor.nationalId}</td>
              <td className="py-4 px-6 text-right">
                <button
                  onClick={() => openModal(doctor)}
                  className="px-4 py-2 bg-[#071952] text-white rounded hover:bg-[#0a2a70]"
                >
                  اطلاعات حضور
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
