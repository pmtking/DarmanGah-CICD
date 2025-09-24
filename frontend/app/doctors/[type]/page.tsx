"use client";

import { useEffect, useState } from "react";
import api from "@/libs/axios";
import jalaali from "jalaali-js";

interface Shift {
  start: string;
  end: string;
  booked?: string[];
}

interface Doctor {
  personnelId: string;
  name: string;
  specialty: string;
  avatarUrl?: string;
  workingDays: string[]; // بهتره تاریخ باشه (مثل "1403-07-01")
  workingHours: Record<string, { shifts: Shift[] }>;
}

// ---------------- بلاک‌های ۱۵ دقیقه‌ای ----------------
const generateTimeBlocks = (start: string, end: string) => {
  const blocks: string[] = [];
  let [h, m] = start.split(":").map(Number);
  const [endH, endM] = end.split(":").map(Number);

  while (h < endH || (h === endH && m < endM)) {
    blocks.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    m += 15;
    if (m >= 60) {
      h += 1;
      m -= 60;
    }
  }
  return blocks;
};

// ---------------- مودال ----------------
const Modal = ({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div className="bg-white/90 rounded-xl p-6 w-96 relative backdrop-blur-md max-h-[90vh] overflow-y-auto">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 font-bold"
      >
        ×
      </button>
      {children}
    </div>
  </div>
);

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [step, setStep] = useState<number>(1);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    nationalCode: "",
    insuranceType: "",
  });

  const fetchDoctors = async () => {
    try {
      const res = await api.get<Doctor[]>(
        "http://192.171.1.121:4000/api/doctors"
      );
      setDoctors(res.data);
    } catch (err) {
      console.error("❌ خطا در دریافت پزشکان:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleReserve = async () => {
    if (!selectedDoctor || !selectedDay || !selectedTime) {
      return alert("❌ لطفاً روز و ساعت را انتخاب کنید");
    }
    if (
      !formData.fullName ||
      !/^09\d{9}$/.test(formData.phoneNumber) ||
      formData.nationalCode.length !== 10 ||
      !formData.insuranceType
    ) {
      return alert("❌ اطلاعات وارد شده معتبر نیست");
    }

    // تبدیل روز شمسی به میلادی (فرض: selectedDay = "1403-07-01")
    const [jy, jm, jd] = selectedDay.split("-").map(Number);
    const { gy, gm, gd } = jalaali.toGregorian(jy, jm, jd);
    const appointmentDate = `${gy}-${String(gm).padStart(
      2,
      "0"
    )}-${String(gd).padStart(2, "0")}`;

    const payload = {
      ...formData,
      doctorId: selectedDoctor.personnelId, // ✅ اصلاح شد
      appointmentDate,
      appointmentTime: selectedTime,
    };

    try {
      await api.post("http://192.171.1.121:4000/api/appointment/add", payload);
      alert("✅ نوبت با موفقیت ثبت شد");

      // ریست فرم و مودال
      setSelectedDoctor(null);
      setStep(1);
      setSelectedDay(null);
      setSelectedTime(null);
      setFormData({
        fullName: "",
        phoneNumber: "",
        nationalCode: "",
        insuranceType: "",
      });

      // بروزرسانی پزشکان برای آپدیت شدن booked
      await fetchDoctors();
    } catch (err: any) {
      console.error(err);
      const message = err.response?.data?.message || "❌ خطا در ثبت نوبت";
      alert(message);
    }
  };

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-600">
        در حال بارگذاری پزشکان...
      </p>
    );

  return (
    <section className="p-6 doctors-page">
      <h1 className="text-3xl font-bold mb-8 text-center text-white">
        لیست پزشکان
      </h1>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {doctors.map((doctor) => (
          <div
            key={doctor.personnelId}
            className="doctor-card bg-white/20 backdrop-blur-md border border-white/30 rounded-3xl shadow-lg hover:shadow-xl transition p-6 flex flex-col items-center"
          >
            {doctor.avatarUrl ? (
              <img
                src={doctor.avatarUrl}
                alt={doctor.name}
                className="w-28 h-28 rounded-full object-cover mb-4 border-2 border-blue-400"
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-gray-200/50 flex items-center justify-center mb-4 text-gray-500">
                بدون تصویر
              </div>
            )}
            <h3 className="text-xl font-semibold mb-1 text-center text-white">
              {doctor.name}
            </h3>
            <p className="text-blue-300 font-medium mb-3 text-center">
              {doctor.specialty}
            </p>
            <button
              onClick={() => {
                setSelectedDoctor(doctor);
                setStep(1);
                setSelectedDay(null);
                setSelectedTime(null);
              }}
              className="w-full bg-blue-600/70 text-white py-2 rounded-xl hover:bg-blue-700/80 transition font-medium backdrop-blur-sm"
            >
              نوبت گرفتن
            </button>
          </div>
        ))}
      </div>

      {/* مودال رزرو */}
      {selectedDoctor && (
        <Modal onClose={() => setSelectedDoctor(null)}>
          {step === 1 && (
            <>
              <h4 className="font-bold text-gray-800 mb-2">انتخاب روز:</h4>
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedDoctor.workingDays.map((day) => (
                  <button
                    key={day}
                    onClick={() => {
                      setSelectedDay(day);
                      setStep(2);
                      setSelectedTime(null);
                    }}
                    className={`px-3 py-1 rounded ${
                      selectedDay === day
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200/50"
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 2 && selectedDay && (
            <>
              <h4 className="font-bold text-gray-800 mb-2">
                انتخاب ساعت ۱۵ دقیقه‌ای:
              </h4>
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedDoctor.workingHours[selectedDay]?.shifts
                  .flatMap((s) => generateTimeBlocks(s.start, s.end))
                  .map((time) => {
                    const isBooked =
                      selectedDoctor.workingHours[selectedDay].shifts.some(
                        (shift) => shift.booked?.includes(time)
                      );
                    return (
                      <button
                        key={time}
                        disabled={isBooked}
                        onClick={() => {
                          setSelectedTime(time);
                          setStep(3);
                        }}
                        className={`px-3 py-1 rounded transition ${
                          isBooked
                            ? "bg-red-400 text-white cursor-not-allowed"
                            : selectedTime === time
                            ? "bg-green-500 text-white"
                            : "bg-gray-200/50"
                        }`}
                      >
                        {time}
                      </button>
                    );
                  })}
              </div>
            </>
          )}

          {step === 3 && selectedDay && selectedTime && (
            <>
              <h4 className="font-bold text-gray-800 mb-2">اطلاعات شما:</h4>
              <input
                placeholder="نام و نام خانوادگی"
                className="border p-2 rounded w-full mb-2"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
              />
              <input
                placeholder="شماره موبایل"
                className="border p-2 rounded w-full mb-2"
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
              />
              <input
                placeholder="کد ملی"
                className="border p-2 rounded w-full mb-2"
                value={formData.nationalCode}
                onChange={(e) =>
                  setFormData({ ...formData, nationalCode: e.target.value })
                }
              />
              <select
                className="border p-2 rounded w-full mb-3"
                value={formData.insuranceType}
                onChange={(e) =>
                  setFormData({ ...formData, insuranceType: e.target.value })
                }
              >
                <option value="">انتخاب بیمه</option>
                <option value="تأمین اجتماعی">تأمین اجتماعی</option>
                <option value="سلامت">سلامت</option>
                <option value="آزاد">آزاد</option>
                <option value="نیروهای مسلح">نیروهای مسلح</option>
                <option value="سایر">سایر</option>
              </select>
              <button
                onClick={handleReserve}
                className="w-full bg-green-600 text-white py-2 rounded-lg mt-3"
              >
                ثبت نهایی
              </button>
            </>
          )}
        </Modal>
      )}
    </section>
  );
}
