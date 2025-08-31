"use client";

import api from "@/libs/axios";
import { useState } from "react";

type DoctorProfileForm = {
  personnelName: string;
  nationalId: string;
  specialty: string;
  specialtyType:
    | "GENERAL"
    | "SURGEON"
    | "INTERNAL"
    | "PEDIATRIC"
    | "DERMATOLOGY"
    | "RADIOLOGY"
    | "OTHER";
  licenseNumber: string;
  bio: string;
  service: string;
  workingDays: string[];
  workingHours: { start: string; end: string };
  roomNumber: string;
  avatarUrl: string;
  isAvailable: boolean;
  documents: { title: string; fileUrl: string }[];
};

const specialtyTypes = [
  "GENERAL",
  "SURGEON",
  "INTERNAL",
  "PEDIATRIC",
  "DERMATOLOGY",
  "RADIOLOGY",
  "OTHER",
];
const weekDays = [
  "Saturday",
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];

export default function DoctorProfileFormComponent() {
  const [formData, setFormData] = useState<DoctorProfileForm>({
    personnelName: "",
    nationalId: "",
    specialty: "",
    specialtyType: "GENERAL",
    licenseNumber: "",
    bio: "",
    service: "",
    workingDays: [],
    workingHours: { start: "", end: "" },
    roomNumber: "",
    avatarUrl: "",
    isAvailable: true,
    documents: [],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const target = e.target as HTMLInputElement;
      setFormData({ ...formData, [name]: target.checked });
    } else setFormData({ ...formData, [name]: value });
  };

  const handleWorkingDaysChange = (day: string, checked: boolean) => {
    const days = checked
      ? [...formData.workingDays, day]
      : formData.workingDays.filter((d) => d !== day);
    setFormData({ ...formData, workingDays: days });
  };

  const handleDocumentChange = (i: number, field: "title" | "fileUrl", value: string) => {
    const docs = [...formData.documents];
    docs[i][field] = value;
    setFormData({ ...formData, documents: docs });
  };

  const addDocument = () =>
    setFormData({
      ...formData,
      documents: [...formData.documents, { title: "", fileUrl: "" }],
    });

  const removeDocument = (i: number) =>
    setFormData({
      ...formData,
      documents: formData.documents.filter((_, idx) => idx !== i),
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      personnelName: formData.personnelName,
      nationalId: formData.nationalId,
      specialty: formData.specialty,
      specialtyType: formData.specialtyType,
      licenseNumber: formData.licenseNumber,
      bio: formData.bio,
      service: formData.service,
      workingDays: formData.workingDays,
      workingHours: formData.workingHours,
      roomNumber: formData.roomNumber,
      avatarUrl: formData.avatarUrl,
      isAvailable: formData.isAvailable,
      documents: formData.documents.map((d) => ({ title: d.title, fileUrl: d.fileUrl })),
    };

    try {
      const res = await api.post("/api/doctors/add", payload);
      console.log("پروفایل پزشک ایجاد شد:", res.data);
      alert("پروفایل پزشک با موفقیت ایجاد شد");

      setFormData({
        personnelName: "",
        nationalId: "",
        specialty: "",
        specialtyType: "GENERAL",
        licenseNumber: "",
        bio: "",
        service: "",
        workingDays: [],
        workingHours: { start: "", end: "" },
        roomNumber: "",
        avatarUrl: "",
        isAvailable: true,
        documents: [],
      });
    } catch (err: any) {
      console.error(err.response?.data || err.message);
      alert("خطا در ارسال فرم: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-5 bg-white/30 backdrop-blur-md rounded-xl shadow-md">
      <h2 className="text-xl font-bold text-[#071952] mb-4 text-center">
        افزودن / ویرایش پزشک
      </h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            type="text"
            name="personnelName"
            value={formData.personnelName}
            onChange={handleChange}
            placeholder="نام پرسنل"
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="nationalId"
            value={formData.nationalId}
            onChange={handleChange}
            placeholder="کد ملی"
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="specialty"
            value={formData.specialty}
            onChange={handleChange}
            placeholder="تخصص"
            className="p-2 border rounded"
          />
          <select
            name="specialtyType"
            value={formData.specialtyType}
            onChange={handleChange}
            className="p-2 border rounded"
          >
            {specialtyTypes.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
          <input
            type="text"
            name="licenseNumber"
            value={formData.licenseNumber}
            onChange={handleChange}
            placeholder="شماره نظام پزشکی"
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="service"
            value={formData.service}
            onChange={handleChange}
            placeholder="سرویس کلینیک"
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="roomNumber"
            value={formData.roomNumber}
            onChange={handleChange}
            placeholder="شماره اتاق"
            className="p-2 border rounded"
          />
        </div>

        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          placeholder="بیوگرافی"
          className="w-full p-2 border rounded"
        />

        <div className="flex gap-2">
          <input
            type="time"
            value={formData.workingHours.start}
            onChange={(e) =>
              setFormData({
                ...formData,
                workingHours: { ...formData.workingHours, start: e.target.value },
              })
            }
            className="flex-1 p-2 border rounded"
          />
          <input
            type="time"
            value={formData.workingHours.end}
            onChange={(e) =>
              setFormData({
                ...formData,
                workingHours: { ...formData.workingHours, end: e.target.value },
              })
            }
            className="flex-1 p-2 border rounded"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {weekDays.map((day) => (
            <label key={day} className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={formData.workingDays.includes(day)}
                onChange={(e) => handleWorkingDaysChange(day, e.target.checked)}
              />{" "}
              {day}
            </label>
          ))}
        </div>

        <input
          type="text"
          name="avatarUrl"
          value={formData.avatarUrl}
          onChange={handleChange}
          placeholder="آواتار (URL)"
          className="w-full p-2 border rounded"
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isAvailable"
            checked={formData.isAvailable}
            onChange={handleChange}
          />{" "}
          فعال
        </label>

        <div>
          {formData.documents.map((doc, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="عنوان"
                value={doc.title}
                onChange={(e) => handleDocumentChange(i, "title", e.target.value)}
                className="flex-1 p-2 border rounded"
              />
              <input
                type="text"
                placeholder="لینک فایل"
                value={doc.fileUrl}
                onChange={(e) => handleDocumentChange(i, "fileUrl", e.target.value)}
                className="flex-1 p-2 border rounded"
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
          ذخیره پزشک
        </button>
      </form>
    </div>
  );
}
