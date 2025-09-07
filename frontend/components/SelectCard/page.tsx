"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useReserveAppointment } from "@/hooks/useAppointment";
import dayjs from "dayjs";
import "dayjs/locale/fa";
import axios from "axios";
import api from "@/libs/axios";
import toast from "react-hot-toast";

interface SelectCardProps {
  doctorId: string;
}

interface Doctor {
  workingDays: string[];
  workingHours: {
    شروع: string;
    پایان: string;
  };
}

const SelectCard: React.FC<SelectCardProps> = ({ doctorId }) => {
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loadingDoctor, setLoadingDoctor] = useState(true);
  const [step, setStep] = useState(1);
  const [selectedTime, setSelectedTime] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    nationalCode: "",
    phone: "",
    insuranceType: "",
  });

  const { reserve, loading, error, success } = useReserveAppointment();

  // گرفتن اطلاعات پزشک از API
  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await api.get(`/api/doctors/${doctorId}`);
        setDoctor(res.data);
      } catch (err) {
        console.error("خطا در دریافت اطلاعات پزشک:", err);
      } finally {
        setLoadingDoctor(false);
      }
    };

    fetchDoctor();
  }, [doctorId]);

  // محاسبه تایم‌ها
  const times = useMemo(() => {
    if (!doctor) return [];

    const today = dayjs().locale("fa");
    const weekday = today.format("dddd");

    if (!doctor.workingDays.includes(weekday)) return [];

    const start = dayjs(`${today.format("YYYY-MM-DD")} ${doctor.workingHours.شروع}`);
    const end = dayjs(`${today.format("YYYY-MM-DD")} ${doctor.workingHours.پایان}`);

    if (dayjs().isAfter(end)) return [];

    const slots: string[] = [];
    let current = start;

    while (current.isBefore(end)) {
      if (current.isAfter(dayjs())) {
        slots.push(`امروز ${weekday} ساعت ${current.format("HH:mm")}`);
      }
      current = current.add(20, "minute");
    }
    return slots;
  }, [doctor]);

  const insuranceOptions = ["سلامت", "تأمین اجتماعی", "نیروهای مسلح", "فاقد بیمه"];

  const handleSelectTime = (time: string) => setSelectedTime(time);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('نوبت شما فعال شد لطفا در اسراع وقت حضور داشته باشید')

    const [_, time] = selectedTime.replace("امروز ", "").split(" ساعت ");

    const payload = {
      fullName: formData.name,
      phoneNumber: formData.phone,
      insuranceType: formData.insuranceType,
      nationalCode: formData.nationalCode,
      doctorId,
      appointmentDate: dayjs().format("YYYY-MM-DD"),
      appointmentTime: time,
    };

    await reserve(payload);
    
     
  };

  if (loadingDoctor) {
    return <p className="text-center text-gray-500">در حال بارگذاری اطلاعات پزشک...</p>;
  }

  if (!doctor) {
    return <p className="text-center text-red-500">اطلاعات پزشک یافت نشد ❌</p>;
  }

  return (
    <div className="w-full mx-auto p-4">
      {step === 1 && (
        <div className="flex flex-col gap-3">
          {times.length === 0 ? (
            <p className="text-center text-gray-500 text-sm">
              نوبتی برای امروز وجود ندارد ❌
            </p>
          ) : (
            times.map((time, idx) => (
              <label
                key={idx}
                onClick={() => handleSelectTime(time)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-medium cursor-pointer transition-all ${
                  selectedTime === time
                    ? "bg-white text-[#00245a] border-[#00245a] shadow-md"
                    : "bg-transparent text-[#00245a] border-[#444444] opacity-70"
                }`}
              >
                {time}
                <span
                  className={`w-5 h-5 flex items-center justify-center border-2 rounded-full ${
                    selectedTime === time
                      ? "border-[#00245a] bg-[#00245a]"
                      : "border-[#444444]"
                  }`}
                >
                  {selectedTime === time && (
                    <span className="w-2 h-2 bg-white rounded-full" />
                  )}
                </span>
              </label>
            ))
          )}

          <button
            disabled={!selectedTime}
            onClick={() => setStep(2)}
            className={`mt-4 bg-[#00245a] text-white rounded-xl py-3 px-4 text-sm font-medium transition-all ${
              !selectedTime
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-[#001a40]"
            }`}
          >
            تکمیل رزرو نوبت برای {selectedTime}
          </button>
        </div>
      )}

      {step === 2 && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
          <input
            name="name"
            type="text"
            placeholder="مثال: کوروش هخامنشی"
            value={formData.name}
            onChange={handleChange}
            className="p-3 rounded-xl border border-gray-300"
            required
          />
          <input
            name="nationalCode"
            type="text"
            placeholder="مثال: ۱۰۵۵۵۵۶۵۶۵"
            value={formData.nationalCode}
            onChange={handleChange}
            className="p-3 rounded-xl border border-gray-300"
            required
          />
          <input
            name="phone"
            type="text"
            placeholder="مثال: ۰۹۳۶۷۸۹۸۰۵۰"
            value={formData.phone}
            onChange={handleChange}
            className="p-3 rounded-xl border border-gray-300"
            required
          />
          <select
            name="insuranceType"
            value={formData.insuranceType}
            onChange={handleChange}
            className="px-3 py-3 rounded-xl border border-gray-300"
            required
          >
            <option value="">نوع بیمه</option>
            {insuranceOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && (
            <p className="text-green-600 text-sm">رزرو با موفقیت انجام شد ✅</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`mt-2 bg-[#00245a] text-white rounded-xl py-3 px-4 text-sm font-medium transition-all ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#001a40]"
            }`}
          >
            {loading
              ? "در حال ارسال..."
              : `ثبت نهایی رزرو برای ${selectedTime}`}
          </button>
        </form>
      )}
    </div>
  );
};

export default SelectCard;
