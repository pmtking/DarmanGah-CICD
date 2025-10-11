"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import api from "@/libs/axios";
import jalaali from "jalaali-js";
import toast from "react-hot-toast";
import Image from "next/image";

// 🩺 مدل داده پزشک
interface Doctor {
  personnelId: string;
  name: string;
  specialty: string;
  avatarUrl?: string;
  workingHours: Record<string, { shifts: { start: string; end: string }[] }>;
}

// 🕒 ساخت بلاک‌های زمانی ۱۵ دقیقه‌ای
const generateTimeBlocks = (start: string, end: string) => {
  const blocks: string[] = [];
  let [h, m] = start.split(":").map(Number);
  const [endH, endM] = end.split(":").map(Number);
  while (h < endH || (h === endH && m < endM)) {
    blocks.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    m += 15;
    if (m >= 60) { h += 1; m -= 60; }
  }
  return blocks;
};

// 🔢 تبدیل اعداد فارسی به انگلیسی
const toEnglishDigits = (str: string) =>
  str
    .replace(/[\u06F0-\u06F9]/g, d => String(d.charCodeAt(0) - 1776))
    .replace(/[\u0660-\u0669]/g, d => String(d.charCodeAt(0) - 1632));

// 🔲 مودال ساده
const Modal = ({ children, onClose }: { children: React.ReactNode; onClose: () => void }) => (
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
  const pathname = usePathname();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [step, setStep] = useState(1);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    nationalCode: "",
    insuranceType: "",
  });

  // 🧠 اصلاح URL عکس در صورت localhost بودن
  const fixAvatarUrl = (url?: string) => {
    if (!url) return "/images/defult.png";
    if (url.startsWith("http://localhost")) {
      return url.replace("http://localhost:4000", "https://api.df-neyshabor.ir");
    }
    if (!url.startsWith("http")) {
      return `https://api.df-neyshabor.ir${url.startsWith("/") ? "" : "/"}${url}`;
    }
    return url;
  };

  // 🔄 دریافت لیست پزشکان
  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const res = await api.get<Doctor[]>("api/doctors");
      let filtered = res.data;

      if (pathname.includes("general")) filtered = filtered.filter(d => d.specialty === "عمومی");
      else if (pathname.includes("dentist")) filtered = filtered.filter(d => d.specialty === "دندان پزشک");
      else if (pathname.includes("specialist"))
        filtered = filtered.filter(d => d.specialty !== "عمومی" && d.specialty !== "دندان پزشک");

      // اصلاح آدرس عکس‌ها
      filtered = filtered.map(d => ({ ...d, avatarUrl: fixAvatarUrl(d.avatarUrl) }));

      setDoctors(filtered);
    } catch (err) {
      console.error("❌ خطا در دریافت پزشکان:", err);
      toast.error("خطا در دریافت لیست پزشکان");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDoctors(); }, [pathname]);

  // 🕒 دریافت تایم‌های آزاد
  const fetchAvailableTimes = async (doctorId: string, day: string) => {
    try {
      const [jy, jm, jd] = day.split("-").map(Number);
      const { gy, gm, gd } = jalaali.toGregorian(jy, jm, jd);
      const appointmentDate = `${gy}-${String(gm).padStart(2, "0")}-${String(gd).padStart(2, "0")}`;

      const res = await api.post<{ bookedTimes: string[] }>("api/appointment/available", {
        doctorId, appointmentDate,
      });
      setAvailableTimes(res.data.bookedTimes || []);
    } catch (err) {
      console.error("❌ خطا در دریافت تایم‌های آزاد:", err);
      toast.error("خطا در دریافت زمان‌های آزاد");
    }
  };

  // 🩺 ثبت نوبت
  const handleReserve = async () => {
    if (!selectedDoctor || !selectedDay || !selectedTime) {
      toast.error("لطفاً روز و ساعت را انتخاب کنید");
      return;
    }

    const phone = toEnglishDigits(formData.phoneNumber);
    const national = toEnglishDigits(formData.nationalCode);

    if (!formData.fullName || !/^09\d{9}$/.test(phone) || national.length !== 10 || !formData.insuranceType) {
      toast.error("اطلاعات وارد شده معتبر نیست");
      return;
    }

    try {
      const [jy, jm, jd] = selectedDay.split("-").map(Number);
      const { gy, gm, gd } = jalaali.toGregorian(jy, jm, jd);
      const appointmentDate = `${gy}-${String(gm).padStart(2, "0")}-${String(gd).padStart(2, "0")}`;

      await api.post("api/appointment/add", {
        fullName: formData.fullName,
        phoneNumber: phone,
        nationalCode: national,
        insuranceType: formData.insuranceType,
        doctorId: selectedDoctor.personnelId,
        appointmentDate,
        appointmentTime: selectedTime,
      });

      toast.success("نوبت با موفقیت ثبت شد 🎉");
      setSelectedDoctor(null);
      setStep(1);
      setFormData({ fullName: "", phoneNumber: "", nationalCode: "", insuranceType: "" });
      fetchDoctors();
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 409) toast.error("این نوبت قبلاً رزرو شده است");
      else toast.error("خطا در ثبت نوبت");
    }
  };

  if (loading)
    return <p className="text-center mt-10 text-gray-300">در حال بارگذاری پزشکان...</p>;

  return (
    <section className="p-6">
      <h1 className="text-3xl font-bold mb-8 text-center text-white">
        {pathname.includes("general")
          ? "پزشکان عمومی"
          : pathname.includes("dentist")
          ? "پزشکان دندان پزشک"
          : pathname.includes("specialist")
          ? "پزشکان متخصص"
          : "لیست پزشکان"}
      </h1>

      {doctors.length === 0 ? (
        <p className="text-center text-gray-300">❌ هیچ پزشکی موجود نیست</p>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {doctors.map((doctor) => {
            const imageSrc = fixAvatarUrl(doctor.avatarUrl);
            const isDentist = doctor.specialty === "دندان پزشک";
            return (
              <div
                key={doctor.personnelId}
                className="bg-white/20 backdrop-blur-md border border-white/30 rounded-3xl shadow-lg hover:shadow-xl transition p-6 flex flex-col items-center"
              >
                <Image
                  src={imageSrc}
                  alt={doctor.name}
                  width={112}
                  height={112}
                  className="rounded-full object-cover mb-4 border-2 h-full"
                />
                <h3 className="text-xl font-semibold mb-1 text-center text-white">{doctor.name}</h3>
                <p className="text-blue-300 font-medium mb-3 text-center">{doctor.specialty}</p>

                <button
                  onClick={() => {
                    if (isDentist) {
                      toast.error("نوبت‌دهی برای دندان پزشک غیرفعال است");
                      return;
                    }
                    setSelectedDoctor(doctor);
                    setStep(1);
                    setSelectedDay(null);
                    setSelectedTime(null);
                  }}
                  disabled={isDentist}
                  className={`w-full py-2 rounded-xl transition font-medium ${
                    isDentist
                      ? "bg-gray-500/50 text-gray-300 cursor-not-allowed"
                      : "bg-blue-600/70 text-white hover:bg-blue-700/80"
                  }`}
                >
                  {isDentist ? "نوبت‌دهی غیرفعال" : "نوبت گرفتن"}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {selectedDoctor && (
        <Modal onClose={() => setSelectedDoctor(null)}>
          {step === 1 && (
            <>
              <h4 className="font-bold text-gray-800 mb-2">انتخاب روز:</h4>
              <div className="flex flex-wrap gap-2 mb-4">
                {Object.keys(selectedDoctor.workingHours).length > 0 ? (
                  Object.keys(selectedDoctor.workingHours).map((day) => (
                    <button
                      key={day}
                      onClick={() => {
                        setSelectedDay(day);
                        setStep(2);
                        setSelectedTime(null);
                        fetchAvailableTimes(selectedDoctor.personnelId, day);
                      }}
                      className={`px-3 py-1 rounded ${
                        selectedDay === day ? "bg-blue-500 text-white" : "bg-gray-200/50"
                      }`}
                    >
                      {day}
                    </button>
                  ))
                ) : (
                  <p className="text-gray-500">❌ روز کاری ثبت نشده</p>
                )}
              </div>
            </>
          )}

          {step === 2 && selectedDay && (
            <>
              <h4 className="font-bold text-gray-800 mb-2">انتخاب ساعت:</h4>
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedDoctor.workingHours[selectedDay]?.shifts ? (
                  selectedDoctor.workingHours[selectedDay].shifts
                    .flatMap((s) => generateTimeBlocks(s.start, s.end))
                    .map((time) => {
                      const isBooked = availableTimes.includes(time);
                      return (
                        <button
                          key={time}
                          disabled={isBooked}
                          onClick={() => { setSelectedTime(time); setStep(3); }}
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
                    })
                ) : (
                  <p className="text-gray-500">❌ شیفتی ثبت نشده</p>
                )}
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h4 className="font-bold text-gray-800 mb-2">اطلاعات شما:</h4>
              <input placeholder="نام و نام خانوادگی" className="border p-2 rounded w-full mb-2"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} />
              <input placeholder="شماره موبایل" className="border p-2 rounded w-full mb-2"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: toEnglishDigits(e.target.value) })} />
              <input placeholder="کد ملی" className="border p-2 rounded w-full mb-2"
                value={formData.nationalCode}
                onChange={(e) => setFormData({ ...formData, nationalCode: toEnglishDigits(e.target.value) })} />
              <select className="border p-2 rounded w-full mb-3"
                value={formData.insuranceType}
                onChange={(e) => setFormData({ ...formData, insuranceType: e.target.value })}>
                <option value="">انتخاب بیمه</option>
                <option value="تأمین اجتماعی">تأمین اجتماعی</option>
                <option value="سلامت">سلامت</option>
                <option value="آزاد">آزاد</option>
                <option value="نیروهای مسلح">نیروهای مسلح</option>
                <option value="سایر">سایر</option>
              </select>
              <button onClick={handleReserve} className="w-full bg-green-600 text-white py-2 rounded-lg mt-3">
                ثبت نهایی
              </button>
            </>
          )}
        </Modal>
      )}
    </section>
  );
}
