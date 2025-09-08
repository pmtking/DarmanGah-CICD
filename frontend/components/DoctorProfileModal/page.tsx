"use client";

import { useEffect, useState } from "react";
import api from "@/libs/axios";

type DoctorProfileForm = {
  personnelName: string;
  nationalId: string;
  specialty: string;
  specialtyType:
    | "پزشک عمومی"
    | "جراح"
    | "داخلی"
    | "اطفال"
    | "پوست"
    | "رادیولوژی"
    | "سایر";
  licenseNumber: string;
  bio: string;
  service: string;
  workingDays: string[];
  workingHours: { شروع: string; پایان: string };
  roomNumber: string;
  avatarUrl: string;
  isAvailable: boolean;
  documents: { title: string; fileUrl: string }[];
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  doctorName?: string;
  nationalId?: string;
};

const specialtyTypes = [
  "پزشک عمومی",
  "جراح",
  "داخلی",
  "اطفال",
  "پوست",
  "رادیولوژی",
  "سایر",
];

const weekDays = [
  "شنبه",
  "یک‌شنبه",
  "دوشنبه",
  "سه‌شنبه",
  "چهارشنبه",
  "پنج‌شنبه",
  "جمعه",
];

export default function DoctorProfileModal({
  isOpen,
  onClose,
  doctorName,
  nationalId,
}: Props) {
  const [formData, setFormData] = useState<DoctorProfileForm>({
    personnelName: doctorName || "",
    nationalId: nationalId || "",
    specialty: "",
    specialtyType: "پزشک عمومی",
    licenseNumber: "",
    bio: "",
    service: "",
    workingDays: [],
    workingHours: { شروع: "", پایان: "" },
    roomNumber: "",
    avatarUrl: "",
    isAvailable: true,
    documents: [],
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      personnelName: doctorName || "",
      nationalId: nationalId || "",
    }));
  }, [isOpen, doctorName, nationalId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = type === "checkbox" && (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleWorkingDaysChange = (day: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      workingDays: checked
        ? [...prev.workingDays, day]
        : prev.workingDays.filter((d) => d !== day),
    }));
  };

  const handleDocumentChange = (
    index: number,
    field: "title" | "fileUrl",
    value: string
  ) => {
    const updatedDocs = [...formData.documents];
    updatedDocs[index][field] = value;
    setFormData((prev) => ({ ...prev, documents: updatedDocs }));
  };

  const addDocument = () =>
    setFormData((prev) => ({
      ...prev,
      documents: [...prev.documents, { title: "", fileUrl: "" }],
    }));

  const removeDocument = (index: number) =>
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index),
    }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/api/doctors/add", formData);
      alert("پزشک جدید با موفقیت ثبت شد!");
      onClose();
    } catch (err: any) {
      alert(
        "خطا در ثبت اطلاعات: " + (err.response?.data?.message || err.message)
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
      <div className="bg-white/30 backdrop-blur-md border border-white/40 rounded-xl p-6 max-w-3xl w-full shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white text-lg font-bold"
        >
          ✕
        </button>
        <h2 className="text-xl text-[#fff] font-bold mb-4 text-center">
          ثبت اطلاعات پزشک
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              name="personnelName"
              value={formData.personnelName}
              onChange={handleChange}
              placeholder="نام پزشک"
              className={inputClass}
            />
            <input
              name="nationalId"
              value={formData.nationalId}
              onChange={handleChange}
              placeholder="کد ملی"
              className={inputClass}
            />
            <input
              name="specialty"
              value={formData.specialty}
              onChange={handleChange}
              placeholder="تخصص"
              className={inputClass}
            />
            <select
              name="specialtyType"
              value={formData.specialtyType}
              onChange={handleChange}
              className={inputClass}
            >
              {specialtyTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <input
              name="licenseNumber"
              value={formData.licenseNumber}
              onChange={handleChange}
              placeholder="شماره نظام پزشکی"
              className={inputClass}
            />
            <input
              name="service"
              value={formData.service}
              onChange={handleChange}
              placeholder="سرویس کلینیک"
              className={inputClass}
            />
            <input
              name="roomNumber"
              value={formData.roomNumber}
              onChange={handleChange}
              placeholder="شماره اتاق"
              className={inputClass}
            />
          </div>

          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="بیوگرافی"
            className={`${inputClass} w-full`}
          />

          <div className="flex gap-2">
            <input
              type="time"
              value={formData.workingHours.شروع}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  workingHours: { ...prev.workingHours, شروع: e.target.value },
                }))
              }
              className={`${inputClass} flex-1`}
            />
            <input
              type="time"
              value={formData.workingHours.پایان}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  workingHours: { ...prev.workingHours, پایان: e.target.value },
                }))
              }
              className={`${inputClass} flex-1`}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {weekDays.map((day) => (
              <label
                key={day}
                className="flex items-center gap-1 text-[#071952]"
              >
                <input
                  type="checkbox"
                  checked={formData.workingDays.includes(day)}
                  onChange={(e) =>
                    handleWorkingDaysChange(day, e.target.checked)
                  }
                />
                {day}
              </label>
            ))}
          </div>

          <input
            name="avatarUrl"
            value={formData.avatarUrl}
            onChange={handleChange}
            placeholder="آواتار (URL)"
            className={`${inputClass} w-full`}
          />

          <label className="flex items-center gap-2 text-[#071952]">
            <input
              type="checkbox"
              name="isAvailable"
              checked={formData.isAvailable}
              onChange={handleChange}
            />
            فعال
          </label>

          <div className="space-y-2">
            {formData.documents.map((doc, i) => (
              <div key={i} className="flex gap-2">
                <input
                  value={doc.title}
                  onChange={(e) =>
                    handleDocumentChange(i, "title", e.target.value)
                  }
                  placeholder="عنوان"
                  className={`${inputClass} flex-1`}
                />
                <input
                  value={doc.fileUrl}
                  onChange={(e) =>
                    handleDocumentChange(i, "fileUrl", e.target.value)
                  }
                  placeholder="لینک فایل"
                  className={`${inputClass} flex-1`}
                />
                <button
                  type="button"
                  onClick={() => removeDocument(i)}
                  className="px-2 py-1 bg-red-500 text-white rounded"
                >
                  حذف
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addDocument}
              className="px-4 py-2 bg-[#071952] text-white rounded hover:bg-[#0a2a70]"
            >
              + مدرک جدید
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-[#071952] text-white rounded hover:bg-[#0a2a70]"
          >
            ثبت اطلاعات پزشک
          </button>
        </form>
      </div>
    </div>
  );
}

const inputClass =
  "p-2 rounded border border-white/40 bg-white/10 text-[#071952]";
