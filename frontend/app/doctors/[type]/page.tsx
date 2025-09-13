"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/libs/axios";

interface Doctor {
  _id: string;
  name: string;
  specialty: string;
  specialtyType: string;
  email: string;
  workingDays: string[];
  workingHours: {
    [day: string]: { شروع: string; پایان: string; booked?: string[] };
  };
  avatarUrl?: string;
}

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const params = useParams();
  // بررسی نوع پارامتر قبل از decode
  const type =
    typeof params?.type === "string" ? decodeURIComponent(params.type).trim() : undefined;

  const fetchDoctors = async () => {
    try {
      const res = await api.get<Doctor[]>(`/api/doctors`);
      setDoctors(res.data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const typeMap: Record<string, string[]> = {
    عمومی: ["پزشک عمومی"],
    دندان‌پزشک: ["دندان‌پزشک"],
    متخصص: ["جراح", "داخلی", "اطفال", "پوست", "رادیولوژی", "سایر"],
  };

  const filteredDoctors = type
    ? doctors.filter((doc) => {
        if (type === "عمومی")
          return typeMap["عمومی"].includes(doc.specialtyType);
        if (type === "دندان‌پزشک")
          return typeMap["دندان‌پزشک"].includes(doc.specialtyType);
        return typeMap["متخصص"].includes(doc.specialtyType);
      })
    : [];

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-600">در حال بارگذاری...</p>
    );

  return (
    <section className="p-6 doctors-page">
      <h1 className="text-3xl font-bold mb-8 text-center text-white">
        {type ? `لیست پزشکان ${type}` : "هیچ دسته‌ای انتخاب نشده است"}
      </h1>

      {filteredDoctors.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">
          هیچ پزشکی برای این دسته موجود نیست
        </p>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredDoctors.map((doctor) => (
            <div
              key={doctor._id}
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
                  عکس ندارد
                </div>
              )}

              <h3 className="text-xl font-semibold mb-1 text-center text-white">
                {doctor.name}
              </h3>
              <p className="text-blue-300 font-medium mb-3 text-center">
                {doctor.specialty}
              </p>

              <div className="w-full mb-3">
                <p className="text-sm font-bold text-white">روزهای حضور:</p>
                <p className="text-sm text-gray-200">
                  {doctor.workingDays?.join(" ، ") || "-"}
                </p>
              </div>

              <div className="w-full mb-4">
                <p className="text-sm font-bold text-white">ساعات حضور:</p>
                <p className="text-sm text-gray-200">
                  {selectedDay && doctor.workingHours[selectedDay]
                    ? `${doctor.workingHours[selectedDay].شروع} - ${doctor.workingHours[selectedDay].پایان}`
                    : `${doctor.workingHours["شنبه"]?.شروع || "-"} - ${
                        doctor.workingHours["شنبه"]?.پایان || "-"
                      }`}
                </p>
              </div>

              <button
                onClick={() =>
                  setSelectedDoctorId(
                    selectedDoctorId === doctor._id ? null : doctor._id
                  )
                }
                className="w-full bg-blue-600/70 text-white py-2 rounded-xl hover:bg-blue-700/80 transition font-medium backdrop-blur-sm"
              >
                نوبت گرفتن
              </button>

              {selectedDoctorId === doctor._id && (
                <div className="mt-4 w-full">
                  <h4 className="font-bold text-white mb-2">انتخاب روز:</h4>
                  <div className="flex flex-wrap gap-2">
                    {doctor.workingDays.map((day) => (
                      <button
                        key={day}
                        onClick={() => setSelectedDay(day)}
                        className={`px-3 py-1 rounded ${
                          selectedDay === day
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200/50"
                        }`}
                      >
                        {day} ({doctor.workingHours[day]?.booked?.length || 0} نوبت)
                      </button>
                    ))}
                  </div>

                  {selectedDay && (
                    <>
                      <h4 className="font-bold text-white mt-3 mb-2">
                        انتخاب ساعت:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {doctor.workingHours[selectedDay]?.booked?.map((hour) => (
                          <button
                            key={hour}
                            onClick={() => setSelectedTime(hour)}
                            className={`px-3 py-1 rounded ${
                              selectedTime === hour
                                ? "bg-green-500 text-white"
                                : "bg-gray-200/50"
                            }`}
                          >
                            {hour}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default DoctorsPage;
