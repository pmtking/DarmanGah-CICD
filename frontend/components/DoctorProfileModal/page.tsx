"use client";

import { useEffect, useState } from "react";
import api from "@/libs/axios";

type Shift = { start: string; end: string };

type DoctorProfileForm = {
  personnelName: string;
  nationalId: string;
  specialty: string;
  specialtyType: string;
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
  "پزشک عمومی","جراح عمومی","جراح مغز و اعصاب","جراح قلب","جراح ارتوپد",
  "داخلی","اطفال","پوست و مو","رادیولوژی","مامائی","دندان‌پزشکی",
  "اورولوژی","روان‌شناسی","تغذیه","زنان و زایمان","قلب و عروق", 
  "گوارش","فیزیوتراپی","عفونی","بیهوشی","چشم‌پزشکی",
  "گوش و حلق و بینی","طب اورژانس","طب کار","طب فیزیکی و توانبخشی","سایر",
];

const weekDays = ["شنبه","یک‌شنبه","دوشنبه","سه‌شنبه","چهارشنبه","پنج‌شنبه","جمعه"];

export default function DoctorProfileModal({ isOpen, onClose, doctorName, nationalId, personnelId }: Props) {
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

  // Load doctor info
  useEffect(() => {
    if (isOpen && personnelId) {
      api.get(`/api/doctors/${personnelId}`)
        .then(res => {
          const data = res.data;
          setFormData(prev => ({ ...prev, ...data }));
        })
        .catch(err => alert("❌ خطا در دریافت اطلاعات: " + (err.response?.data?.message || err.message)));
    }
  }, [isOpen, personnelId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === "checkbox" && (e.target as HTMLInputElement).checked;
    setFormData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleWorkingDaysChange = (day: string, checked: boolean) => {
    setFormData(prev => {
      const newDays = checked ? [...prev.workingDays, day] : prev.workingDays.filter(d => d !== day);
      const newHours = { ...prev.workingHours };
      if (checked && !newHours[day]) newHours[day] = { shifts: [{ start: "09:00", end: "17:00" }] };
      if (!checked) delete newHours[day];
      return { ...prev, workingDays: newDays, workingHours: newHours };
    });
  };

  const addShift = (day: string) => {
    setFormData(prev => {
      const shifts = prev.workingHours[day]?.shifts || [];
      return { ...prev, workingHours: { ...prev.workingHours, [day]: { shifts: [...shifts, { start: "09:00", end: "17:00" }] } } };
    });
  };

  const handleShiftChange = (day: string, index: number, field: "start" | "end", value: string) => {
    setFormData(prev => {
      const shifts = prev.workingHours[day]?.shifts.map((s, i) => i === index ? { ...s, [field]: value } : s);
      return { ...prev, workingHours: { ...prev.workingHours, [day]: { shifts } } };
    });
  };

  const removeShift = (day: string, index: number) => {
    setFormData(prev => {
      const shifts = prev.workingHours[day]?.shifts.filter((_, i) => i !== index);
      return { ...prev, workingHours: { ...prev.workingHours, [day]: { shifts } } };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedHours: typeof formData.workingHours = {};
    formData.workingDays.forEach(day => {
      const shifts = formData.workingHours[day]?.shifts || [];
      cleanedHours[day] = { shifts: shifts.map(s => ({ start: s.start || "09:00", end: s.end || "17:00" })) };
    });
    try {
      await api.post("/api/doctors/upsert", { ...formData, workingHours: cleanedHours });
      alert("✅ اطلاعات پزشک ذخیره شد");
      onClose();
    } catch (err: any) {
      alert("❌ خطا در ذخیره اطلاعات: " + (err.response?.data?.message || err.message));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white/70 backdrop-blur-md rounded-xl shadow-xl w-full max-w-2xl p-5 overflow-auto max-h-[85vh] relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 text-lg">✕</button>
        <h2 className="text-xl font-semibold mb-4 text-center text-[#071952]">اطلاعات پزشک</h2>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input name="personnelName" value={formData.personnelName} onChange={handleChange} placeholder="نام پزشک" className={minimalInput} />
            <input name="nationalId" value={formData.nationalId} onChange={handleChange} placeholder="کد ملی" className={minimalInput} />
            <input name="specialty" value={formData.specialty} onChange={handleChange} placeholder="زیرتخصص" className={minimalInput} />
            <select name="specialtyType" value={formData.specialtyType} onChange={handleChange} className={minimalInput}>
              {specialtyTypes.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
            <input name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} placeholder="شماره نظام پزشکی" className={minimalInput} />
            <input name="service" value={formData.service} onChange={handleChange} placeholder="سرویس کلینیک" className={minimalInput} />
            <input name="roomNumber" value={formData.roomNumber} onChange={handleChange} placeholder="شماره اتاق" className={minimalInput} />
          </div>

          {/* Working Days */}
          <div>
            <p className="font-medium text-[#071952] mb-1">روزهای حضور:</p>
            <div className="flex flex-wrap gap-2">
              {weekDays.map(day => (
                <label key={day} className="flex items-center gap-1 text-sm cursor-pointer">
                  <input type="checkbox" checked={formData.workingDays.includes(day)} onChange={e => handleWorkingDaysChange(day, e.target.checked)} />
                  {day}
                </label>
              ))}
            </div>

            {/* Shifts Horizontal */}
            {formData.workingDays.map(day => (
              <div key={day} className="mt-2 p-2 bg-white/50 rounded-md border border-gray-200">
                <p className="text-[#071952] font-medium">{day}</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {(formData.workingHours[day]?.shifts || []).map((shift, i) => (
                    <div key={i} className="flex items-center gap-1">
                      <input type="time" value={shift.start} onChange={e => handleShiftChange(day, i, "start", e.target.value)} className="p-1 w-20 rounded border border-gray-300 text-sm text-[#071952] focus:ring-1 focus:ring-[#071952]" />
                      <span>-</span>
                      <input type="time" value={shift.end} onChange={e => handleShiftChange(day, i, "end", e.target.value)} className="p-1 w-20 rounded border border-gray-300 text-sm text-[#071952] focus:ring-1 focus:ring-[#071952]" />
                      <button type="button" onClick={() => removeShift(day, i)} className="text-red-500 text-sm">✕</button>
                    </div>
                  ))}
                  <button type="button" onClick={() => addShift(day)} className="text-blue-600 text-sm ml-2">+ شیفت</button>
                </div>
              </div>
            ))}
          </div>

          <label className="flex items-center gap-2 text-sm font-medium text-[#071952]">
            <input type="checkbox" name="isAvailable" checked={formData.isAvailable} onChange={handleChange} /> فعال
          </label>

          <button type="submit" className="w-full py-2 bg-[#071952] text-white rounded-lg font-medium hover:bg-[#0a2a70] transition-all text-sm">
            ذخیره
          </button>
        </form>
      </div>
    </div>
  );
}

const minimalInput = "p-1 rounded border border-gray-300 text-sm text-[#071952] focus:ring-1 focus:ring-[#071952] focus:border-[#071952] transition-all w-full";
