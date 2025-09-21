"use client";

import { useEffect, useState } from "react";
import api from "@/libs/axios";

type Shift = { start: string; end: string };

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
  service: string;
  workingDays: string[];
  workingHours: { [day: string]: { shifts: Shift[] } };
  roomNumber: string;
  isAvailable: boolean;
  documents: { title: string; fileUrl: string }[];
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  doctorName?: string;
  nationalId?: string;
  personnelId?: string;
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
  personnelId,
}: Props) {
  const [formData, setFormData] = useState<DoctorProfileForm>({
    personnelName: doctorName || "",
    nationalId: nationalId || "",
    specialty: "",
    specialtyType: "پزشک عمومی",
    licenseNumber: "",
    service: "",
    workingDays: [],
    workingHours: {},
    roomNumber: "",
    isAvailable: true,
    documents: [],
  });

  useEffect(() => {
    if (isOpen && personnelId) {
      api
        .get(`/api/doctors/${personnelId}`)
        .then((res) => {
          const data = res.data;

          const workingHours: DoctorProfileForm["workingHours"] = {};
          data.workingDays?.forEach((day: string) => {
            workingHours[day] = { shifts: data.workingHours?.[day]?.shifts || [] };
          });

          setFormData({
            personnelName: data.personnelName || doctorName || "",
            nationalId: data.nationalId || nationalId || "",
            specialty: data.specialty || "",
            specialtyType: data.specialtyType || "پزشک عمومی",
            licenseNumber: data.licenseNumber || "",
            service: data.service || "",
            workingDays: data.workingDays || [],
            workingHours,
            roomNumber: data.roomNumber || "",
            isAvailable: data.isAvailable ?? true,
            documents: data.documents || [],
          });
        })
        .catch((err) =>
          alert(
            "خطا در دریافت اطلاعات: " +
              (err.response?.data?.message || err.message)
          )
        );
    } else if (isOpen) {
      setFormData({
        personnelName: doctorName || "",
        nationalId: nationalId || "",
        specialty: "",
        specialtyType: "پزشک عمومی",
        licenseNumber: "",
        service: "",
        workingDays: [],
        workingHours: {},
        roomNumber: "",
        isAvailable: true,
        documents: [],
      });
    }
  }, [isOpen, personnelId, doctorName, nationalId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = type === "checkbox" && (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleWorkingDaysChange = (day: string, checked: boolean) => {
    setFormData((prev) => {
      const newDays = checked
        ? [...prev.workingDays, day]
        : prev.workingDays.filter((d) => d !== day);

      const newHours = { ...prev.workingHours };
      if (checked && !newHours[day]) newHours[day] = { shifts: [{ start: "09:00", end: "17:00" }] };
      if (!checked) delete newHours[day];

      return { ...prev, workingDays: newDays, workingHours: newHours };
    });
  };

  const addShift = (day: string) => {
    setFormData((prev) => {
      const shifts = prev.workingHours[day]?.shifts || [];
      return {
        ...prev,
        workingHours: {
          ...prev.workingHours,
          [day]: { shifts: [...shifts, { start: "09:00", end: "17:00" }] },
        },
      };
    });
  };

  const handleShiftChange = (
    day: string,
    index: number,
    field: "start" | "end",
    value: string
  ) => {
    setFormData((prev) => {
      const shifts = prev.workingHours[day]?.shifts.map((s, i) =>
        i === index ? { ...s, [field]: value } : s
      );
      return { ...prev, workingHours: { ...prev.workingHours, [day]: { shifts } } };
    });
  };

  const removeShift = (day: string, index: number) => {
    setFormData((prev) => {
      const shifts = prev.workingHours[day]?.shifts.filter((_, i) => i !== index);
      return { ...prev, workingHours: { ...prev.workingHours, [day]: { shifts } } };
    });
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

    if (!formData.personnelName.trim()) {
      alert("نام پرسنل نمی‌تواند خالی باشد");
      return;
    }

    // پر کردن شیفت‌های خالی با مقادیر پیش‌فرض
    const workingHoursWithDefaults = { ...formData.workingHours };
    formData.workingDays.forEach((day) => {
      const shifts = workingHoursWithDefaults[day]?.shifts || [];
      workingHoursWithDefaults[day].shifts = shifts.length
        ? shifts.map((s) => ({ start: s.start || "09:00", end: s.end || "17:00" }))
        : [{ start: "09:00", end: "17:00" }];
    });

    try {
      await api.post("/api/doctors/upsert", {
        ...formData,
        workingHours: workingHoursWithDefaults,
      });
      alert("اطلاعات پزشک ذخیره شد ✅");
      onClose();
    } catch (err: any) {
      alert(
        "خطا در ذخیره اطلاعات: " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white/90 backdrop-blur-md border border-white/40 rounded-xl p-6 max-w-4xl w-full shadow-lg relative overflow-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-700 text-xl font-bold"
        >
          ✕
        </button>
        <h2 className="text-xl font-bold mb-4 text-center">
          ثبت یا بروزرسانی اطلاعات پزشک
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

          <div>
            <p className="font-bold mb-1">روزهای حضور:</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {weekDays.map((day) => (
                <label key={day} className="flex items-center gap-1">
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

            {formData.workingDays.map((day) => (
              <div key={day} className="mb-3 border rounded p-2">
                <p className="font-semibold">{day}</p>
                {(formData.workingHours[day]?.shifts || []).map((shift, i) => (
                  <div key={i} className="flex gap-2 items-center mb-1">
                    <input
                      type="time"
                      value={shift.start}
                      onChange={(e) =>
                        handleShiftChange(day, i, "start", e.target.value)
                      }
                      className={`${inputClass} flex-1`}
                    />
                    <input
                      type="time"
                      value={shift.end}
                      onChange={(e) =>
                        handleShiftChange(day, i, "end", e.target.value)
                      }
                      className={`${inputClass} flex-1`}
                    />
                    <button
                      type="button"
                      onClick={() => removeShift(day, i)}
                      className="px-2 py-1 bg-red-500 text-white rounded"
                    >
                      حذف
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addShift(day)}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  + اضافه کردن شیفت
                </button>
              </div>
            ))}
          </div>

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

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isAvailable"
              checked={formData.isAvailable}
              onChange={handleChange}
            />
            فعال
          </label>

          <button
            type="submit"
            className="w-full py-2 bg-[#071952] text-white rounded hover:bg-[#0a2a70]"
          >
            ذخیره اطلاعات پزشک
          </button>
        </form>
      </div>
    </div>
  );
}

const inputClass =
  "p-2 rounded border border-white/40 bg-white/10 text-[#071952]";
