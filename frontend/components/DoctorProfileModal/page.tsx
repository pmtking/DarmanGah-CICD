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
  "پزشک عمومی","جراح عمومی","جراح مغز و اعصاب","جراح قلب","جراح ارتوپد","داخلی","اطفال","پوست و مو","رادیولوژی","مامائی","دندان‌پزشکی",
  "اورولوژی","روان‌شناسی","تغذیه","زنان و زایمان","قلب و عروق","گوارش","فیزیوتراپی","عفونی","بیهوشی","چشم‌پزشکی","گوش و حلق و بینی",
  "طب اورژانس","طب کار","طب فیزیکی و توانبخشی","سایر"
];

const weekDays = ["شنبه","یک‌شنبه","دوشنبه","سه‌شنبه","چهارشنبه","پنج‌شنبه","جمعه"];

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
    if (!isOpen) return;

    if (personnelId) {
      api.get(`/api/doctors/${personnelId}`)
        .then(res => {
          const data = res.data;
          setFormData(prev => ({
            ...prev,
            personnelName: data.personnelName || prev.personnelName,
            nationalId: data.nationalId || prev.nationalId,
            specialty: data.specialty || "",
            specialtyType: specialtyTypes.includes(data.specialtyType) ? data.specialtyType : "پزشک عمومی",
            licenseNumber: data.licenseNumber || "",
            service: data.service || "",
            workingDays: data.workingDays || [],
            workingHours: data.workingHours || {},
            roomNumber: data.roomNumber || "",
            isAvailable: data.isAvailable ?? true,
            documents: data.documents || [],
          }));
        })
        .catch(err => console.log("❌ خطا در دریافت اطلاعات: " + (err.response?.data?.message || err.message)));
    }
  }, [isOpen, personnelId, doctorName, nationalId]);

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

  const addDocument = () => setFormData(prev => ({ ...prev, documents: [...prev.documents, { title: "", fileUrl: "" }] }));
  const handleDocumentChange = (index: number, field: "title" | "fileUrl", value: string) => {
    const updated = [...formData.documents]; updated[index][field] = value;
    setFormData(prev => ({ ...prev, documents: updated }));
  };
  const removeDocument = (index: number) => setFormData(prev => ({ ...prev, documents: prev.documents.filter((_, i) => i !== index) }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedWorkingHours: typeof formData.workingHours = {};
    formData.workingDays.forEach(day => {
      const shifts = formData.workingHours[day]?.shifts || [];
      cleanedWorkingHours[day] = { shifts: shifts.map(s => ({ start: s.start || "09:00", end: s.end || "17:00" })) };
    });

    try {
      await api.post("/api/doctors/upsert", { ...formData, workingHours: cleanedWorkingHours });
      alert("✅ اطلاعات پزشک ذخیره شد");
      onClose();
    } catch (err: any) {
      alert("❌ خطا در ذخیره اطلاعات: " + (err.response?.data?.message || err.message));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl p-6 overflow-auto max-h-[90vh] relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold">✕</button>
        <h2 className="text-3xl font-extrabold mb-6 text-center text-[#071952]">ثبت / بروزرسانی اطلاعات پزشک</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* اطلاعات پایه */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="نام پزشک" name="personnelName" value={formData.personnelName} onChange={handleChange} />
            <Input label="کد ملی" name="nationalId" value={formData.nationalId} onChange={handleChange} />
            <Input label="زیرتخصص" name="specialty" value={formData.specialty} onChange={handleChange} placeholder="اختیاری" />
            <Select label="نوع تخصص" name="specialtyType" value={formData.specialtyType} onChange={handleChange} options={specialtyTypes} />
            <Input label="شماره نظام پزشکی" name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} />
            <Input label="سرویس کلینیک" name="service" value={formData.service} onChange={handleChange} />
            <Input label="شماره اتاق" name="roomNumber" value={formData.roomNumber} onChange={handleChange} />
          </div>

          {/* روزها و شیفت‌ها */}
          <div>
            <p className="font-bold mb-2 text-[#071952]">روزهای حضور:</p>
            <div className="flex flex-wrap gap-3 mb-4">
              {weekDays.map(day => (
                <label key={day} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.workingDays.includes(day)} onChange={e => handleWorkingDaysChange(day, e.target.checked)} />
                  <span>{day}</span>
                </label>
              ))}
            </div>

            {formData.workingDays.map(day => (
              <div key={day} className="mb-4 border rounded-lg p-3 bg-gray-50">
                <p className="font-semibold text-[#071952]">{day}</p>
                {(formData.workingHours[day]?.shifts || []).map((shift, i) => (
                  <div key={i} className="flex gap-2 items-center mb-2">
                    <input type="time" value={shift.start} onChange={e => handleShiftChange(day, i, "start", e.target.value)} className={inputClass + " flex-1"} />
                    <input type="time" value={shift.end} onChange={e => handleShiftChange(day, i, "end", e.target.value)} className={inputClass + " flex-1"} />
                    <button type="button" onClick={() => removeShift(day, i)} className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600">حذف</button>
                  </div>
                ))}
                <button type="button" onClick={() => addShift(day)} className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700">+ اضافه کردن شیفت</button>
              </div>
            ))}
          </div>

          {/* مدارک */}
          <div className="space-y-2">
            {formData.documents.map((doc, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input value={doc.title} onChange={e => handleDocumentChange(i, "title", e.target.value)} placeholder="عنوان مدرک" className={`${inputClass} flex-1`} />
                <input value={doc.fileUrl} onChange={e => handleDocumentChange(i, "fileUrl", e.target.value)} placeholder="لینک فایل" className={`${inputClass} flex-1`} />
                <button type="button" onClick={() => removeDocument(i)} className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600">حذف</button>
              </div>
            ))}
            <button type="button" onClick={addDocument} className="px-4 py-2 bg-[#071952] text-white rounded-lg hover:bg-[#0a2a70] mt-2">+ مدرک جدید</button>
          </div>

          <label className="flex items-center gap-2 font-medium text-[#071952]">
            <input type="checkbox" name="isAvailable" checked={formData.isAvailable} onChange={handleChange} />
            فعال
          </label>

          <button type="submit" className="w-full py-3 bg-[#071952] text-white rounded-xl font-bold hover:bg-[#0a2a70] transition-all">ذخیره اطلاعات پزشک</button>
        </form>
      </div>
    </div>
  );
}

// 💎 کامپوننت‌های کمکی برای input و select
const Input = ({ label, ...props }: any) => (
  <div className="flex flex-col">
    <label className="text-[#071952] font-medium mb-1">{label}</label>
    <input {...props} className={inputClass} />
  </div>
);

const Select = ({ label, options, ...props }: any) => (
  <div className="flex flex-col">
    <label className="text-[#071952] font-medium mb-1">{label}</label>
    <select {...props} className="appearance-none w-full p-2 pr-10 rounded-lg border border-gray-300 bg-gradient-to-r from-white to-gray-50 shadow-sm focus:ring-2 focus:ring-[#071952] focus:border-[#071952] transition-all text-[#071952] font-medium">
      {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  </div>
);

const inputClass = "p-2 rounded-lg border border-gray-300 bg-white shadow-sm focus:ring-2 focus:ring-[#071952] focus:border-[#071952] transition-all text-[#071952]";
