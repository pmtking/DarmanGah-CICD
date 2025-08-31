"use client";

import { useState } from "react";
import TitleComponents from "@/components/TitleComponents/page";

import AddDoctorButton from "@/components/AddDoctorButton/page";

type Doctor = {
  name: string;
  specialty: string;
  hours: string;
  days: string[];
};

const initialDoctors: Doctor[] = [
  { name: "دکتر احمدی", specialty: "دندان‌پزشکی", hours: "08:00 - 14:00", days: ["شنبه", "سه‌شنبه"] },
  { name: "دکتر موسوی", specialty: "چشم‌پزشکی", hours: "10:00 - 16:00", days: ["یک‌شنبه", "چهارشنبه"] },
  { name: "دکتر رضایی", specialty: "فیزیوتراپی", hours: "09:00 - 15:00", days: ["دوشنبه", "پنج‌شنبه"] },
];

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState(initialDoctors);
  const [selectedDoctorIndex, setSelectedDoctorIndex] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState<Doctor | null>(null);


  const openModal = (index: number | null = null) => {
    setSelectedDoctorIndex(index);
    if (index === null) {
      // مدال برای افزودن پزشک جدید
      setFormData({ name: "", specialty: "", hours: "", days: [] });
    } else {
      setFormData(doctors[index]);
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedDoctorIndex(null);
    setFormData(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!formData) return;
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDaysChange = (index: number, value: string) => {
    if (!formData) return;
    const newDays = [...formData.days];
    newDays[index] = value;
    setFormData({ ...formData, days: newDays });
  };

  const addDay = () => {
    if (!formData) return;
    setFormData({ ...formData, days: [...formData.days, ""] });
  };

  const removeDay = (index: number) => {
    if (!formData) return;
    const newDays = formData.days.filter((_, i) => i !== index);
    setFormData({ ...formData, days: newDays });
  };

  const saveDoctor = () => {
    if (!formData) return;
    if (selectedDoctorIndex === null) {
      // افزودن پزشک جدید
      setDoctors([...doctors, formData]);
    } else {
      // ویرایش پزشک موجود
      const updatedDoctors = [...doctors];
      updatedDoctors[selectedDoctorIndex] = formData;
      setDoctors(updatedDoctors);
    }
    closeModal();
  };
 

  return (
    <>
      <TitleComponents h1="پزشکان" color="#fff" classname="mt-5" />
      <main className="max-w-6xl mx-auto mt-6 p-6">
        {/* دکمه افزودن پزشک */}
        <div className="flex justify-end mb-4">
          <AddDoctorButton />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border rounded-2xl overflow-hidden backdrop-blur-md bg-white/30 shadow-lg">
            <thead style={{ backgroundColor: "#071952" }} className="text-white">
              <tr>
                <th className="py-3 px-6 text-right">نام پزشک</th>
                <th className="py-3 px-6 text-right">تخصص</th>
                <th className="py-3 px-6 text-right">ساعت حضور</th>
                <th className="py-3 px-6 text-right">روزهای حضور</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doctor, index) => (
                <tr
                  key={index}
                  className="cursor-pointer hover:bg-white/20 transition"
                  onClick={() => openModal(index)}
                >
                  <td className="py-4 px-6 text-right">{doctor.name}</td>
                  <td className="py-4 px-6 text-right">{doctor.specialty}</td>
                  <td className="py-4 px-6 text-right">{doctor.hours}</td>
                  <td className="py-4 px-6 text-right">{doctor.days.join("، ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {modalOpen && formData && (
          <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center z-50">
            <div className="relative w-full max-w-md p-6 rounded-2xl shadow-lg bg-white border border-gray-200">
              <button
                onClick={closeModal}
                className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
              >
                ✕
              </button>
              <h2 className="text-xl font-bold mb-4 text-[#071952]">
                {selectedDoctorIndex === null ? "افزودن پزشک جدید" : `${formData.name} - ویرایش`}
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="block mb-1 text-sm text-[#071952]">نام پزشک</label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-2 rounded"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm text-[#071952]">تخصص</label>
                  <input
                    name="specialty"
                    value={formData.specialty}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-2 rounded"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm text-[#071952]">ساعت حضور</label>
                  <input
                    name="hours"
                    value={formData.hours}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-2 rounded"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm text-[#071952]">روزهای حضور</label>
                  {formData.days.map((day, i) => (
                    <div key={i} className="flex gap-2 mb-2 items-center">
                      <input
                        value={day}
                        onChange={(e) => handleDaysChange(i, e.target.value)}
                        className="flex-1 border border-gray-300 p-2 rounded"
                      />
                      <button
                        onClick={() => removeDay(i)}
                        type="button"
                        className="px-2 py-1 bg-red-500 text-white rounded"
                      >
                        حذف
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={addDay}
                    type="button"
                    className="px-4 py-2 bg-[#071952] text-white rounded hover:bg-[#0a2a70]"
                  >
                    + روز جدید
                  </button>
                </div>
                <button
                  onClick={saveDoctor}
                  type="button"
                  className="w-full py-2 bg-[#071952] text-white rounded mt-4 hover:bg-[#0a2a70]"
                >
                  ذخیره تغییرات
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default DoctorsPage;
