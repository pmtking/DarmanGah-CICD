"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useReserveAppointment } from "@/hooks/useAppointment";
import dayjs from "dayjs";
import "dayjs/locale/fa";
import api from "@/libs/axios";
import toast from "react-hot-toast";
import { useSearchParams } from "next/navigation";
import axios from "axios"; // برای ارسال پیامک

interface Shift {
  start: string;
  end: string;
  booked: string[];
  _id: string;
}

interface Doctor {
  _id: string;
  specialty: string;
  specialtyType: string;
  workingDays: string[];
  workingHours: {
    [day: string]: {
      shifts: Shift[];
    };
  };
}

interface SelectCardProps {
  doctorId: string;
}

const SMS_API_URL = "https://edge.ippanel.com/v1/api/send";
const SMS_API_KEY = "9UuMXe-r8_2YJba3zR6dStU1Q3O48DodhQnS2bero20=";

const SelectCard: React.FC<SelectCardProps> = ({ doctorId }) => {
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loadingDoctor, setLoadingDoctor] = useState(true);
  const [step, setStep] = useState(1);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    nationalCode: "",
    phone: "",
    insuranceType: "",
  });

  const searchParams = useSearchParams();
  const queryDay = searchParams.get("day");
  const queryTime = searchParams.get("time");

  const { reserve, loading, error, success } = useReserveAppointment();

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await api.get(`/api/doctors/${doctorId}`);
        setDoctor(res.data);
        if (queryDay) setSelectedDay(queryDay);
        if (queryTime) setSelectedTime(`${queryDay} ساعت ${queryTime}`);
      } catch (err) {
        console.error("خطا در دریافت اطلاعات پزشک:", err);
      } finally {
        setLoadingDoctor(false);
      }
    };
    fetchDoctor();
  }, [doctorId, queryDay, queryTime]);

  const times = useMemo(() => {
    if (!doctor || !selectedDay) return [];
    const dayData = doctor.workingHours[selectedDay];
    if (!dayData) return [];

    const slots: string[] = [];
    dayData.shifts.forEach((shift) => {
      let current = dayjs(`${dayjs().format("YYYY-MM-DD")} ${shift.start}`);
      const end = dayjs(`${dayjs().format("YYYY-MM-DD")} ${shift.end}`);
      while (current.isBefore(end)) {
        const label = `${selectedDay} ساعت ${current.format("HH:mm")}`;
        slots.push(label);
        current = current.add(20, "minute");
      }
    });
    return slots;
  }, [doctor, selectedDay]);

  const insuranceOptions = [
    "سلامت",
    "تأمین اجتماعی",
    "نیروهای مسلح",
    "فاقد بیمه",
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const sendSMS = async (phone: string, day: string, time: string) => {
    try {
      const payload = {
        sending_type: "pattern",
        from_number: "+983000505",
        code: "59szjmh8dalaked",
        recipients: [phone],
        params: {
          day: day,
          time: time,
        },
      };
      await axios.post(SMS_API_URL, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: SMS_API_KEY,
        },
      });
      toast.success("پیامک تأیید نوبت ارسال شد 📩");
    } catch (err) {
      console.error("خطا در ارسال پیامک:", err);
      toast.error("ارسال پیامک با خطا مواجه شد ❌");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTime || !selectedDay) return;

    const [day, time] = selectedTime.split(" ساعت ");

    const payload = {
      fullName: formData.name,
      phoneNumber: formData.phone,
      insuranceType: formData.insuranceType,
      nationalCode: formData.nationalCode,
      doctorId,
      appointmentDay: day,
      appointmentDate: dayjs().format("YYYY-MM-DD"),
      appointmentTime: time,
    };

    await reserve(payload);

    if (!error) {
      toast.success("نوبت شما ثبت شد ✅ لطفا در زمان مقرر حضور داشته باشید");
      await sendSMS(formData.phone, day, time);
    }
  };

  if (loadingDoctor)
    return (
      <p className="text-center text-gray-500">
        در حال بارگذاری اطلاعات پزشک...
      </p>
    );
  if (!doctor)
    return <p className="text-center text-red-500">اطلاعات پزشک یافت نشد ❌</p>;

  return (
    <div className="w-full mx-auto p-4 bg-white rounded-xl shadow-md">
      {step === 1 && (
        <>
          <div className="flex flex-wrap gap-2 mb-4">
            {doctor.workingDays.map((day) => (
              <button
                key={day}
                onClick={() => {
                  setSelectedDay(day);
                  setSelectedTime("");
                }}
                className={`px-3 py-1 rounded text-sm font-medium ${
                  selectedDay === day
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          {selectedDay && (
            <div className="flex flex-col gap-2 max-h-60 overflow-y-auto rounded-lg border p-2">
              {times.length === 0 ? (
                <p className="text-center text-gray-500 text-xs">
                  نوبتی برای این روز وجود ندارد ❌
                </p>
              ) : (
                times.map((time, idx) => (
                  <label
                    key={idx}
                    onClick={() => setSelectedTime(time)}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg border text-xs font-medium cursor-pointer transition-all ${
                      selectedTime === time
                        ? "bg-white text-[#00245a] border-[#00245a] shadow-md"
                        : "bg-transparent text-[#00245a] border-[#444444] opacity-70"
                    }`}
                  >
                    {time}
                    <span
                      className={`w-4 h-4 flex items-center justify-center border-2 rounded-full ${
                        selectedTime === time
                          ? "border-[#00245a] bg-[#00245a]"
                          : "border-[#444444]"
                      }`}
                    >
                      {selectedTime === time && (
                        <span className="w-1.5 h-1.5 bg-white rounded-full" />
                      )}
                    </span>
                  </label>
                ))
              )}
            </div>
          )}

          <button
            disabled={!selectedTime}
            onClick={() => setStep(2)}
            className={`mt-4 bg-[#00245a] w-full text-white rounded-xl py-3 px-4 text-sm font-medium transition-all ${
              !selectedTime
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-[#001a40]"
            }`}
          >
            تکمیل رزرو نوبت برای {selectedTime || "..."}
          </button>
        </>
      )}

      {step === 2 && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
          <input
            name="name"
            type="text"
            placeholder="نام و نام خانوادگی"
            value={formData.name}
            onChange={handleChange}
            className="p-3 rounded-xl border border-gray-300"
            required
          />
          <input
            name="nationalCode"
            type="text"
            placeholder="کد ملی"
            value={formData.nationalCode}
            onChange={handleChange}
            className="p-3 rounded-xl border border-gray-300"
            required
          />
          <input
            name="phone"
            type="text"
            placeholder="شماره تماس"
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

          <div className="flex justify-between items-center mt-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-3 py-2 text-xs rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
            >
              بازگشت
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`bg-[#00245a] text-white rounded-xl py-3 px-4 text-sm font-medium transition-all ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#001a40]"
              }`}
            >
              {loading
                ? "در حال ارسال..."
                : `ثبت نهایی رزرو برای ${selectedTime}`}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default SelectCard;
