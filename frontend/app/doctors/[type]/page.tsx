"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation"; // 🟢 اضافه شد
import api from "@/libs/axios";

interface Shift {
  start: string;
  end: string;
  booked: string[];
}

interface Doctor {
  personnelId: string; // 🟢 کلید اصلی
  _id: string;
  name: string;
  specialty: string;
  specialtyType: string;
  email: string;
  workingDays: string[];
  workingHours: {
    [day: string]: { shifts: Shift[] };
  };
  avatarUrl?: string;
}

// Modal component
const Modal = ({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div className="bg-white/90 rounded-xl p-6 w-80 relative backdrop-blur-md">
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

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const params = useParams();
  const router = useRouter(); // 🟢 اضافه شد

  const type =
    typeof params?.type === "string"
      ? decodeURIComponent(params.type).trim()
      : undefined;

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
    "دندان‌پزشک": ["دندان‌پزشک"],
    متخصص: ["جراح", "داخلی", "اطفال", "پوست", "رادیولوژی", "سایر"],
  };

  const filteredDoctors = type
    ? doctors.filter((doc) => {
        if (type === "عمومی") return typeMap["عمومی"].includes(doc.specialtyType);
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

              <button
                onClick={() => {
                  setSelectedDoctor(doctor);
                  setSelectedDay(null);
                  setShowModal(true);
                }}
                className="w-full bg-blue-600/70 text-white py-2 rounded-xl hover:bg-blue-700/80 transition font-medium backdrop-blur-sm"
              >
                نوبت گرفتن
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && selectedDoctor && (
        <Modal onClose={() => setShowModal(false)}>
          <h4 className="font-bold text-gray-800 mb-2">انتخاب روز:</h4>
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedDoctor.workingDays.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-3 py-1 rounded ${
                  selectedDay === day ? "bg-blue-500 text-white" : "bg-gray-200/50"
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          {selectedDay && (
            <>
              <h4 className="font-bold text-gray-800 mb-2">انتخاب ساعت:</h4>
              <div className="flex flex-wrap gap-2">
                {selectedDoctor.workingHours[selectedDay]?.shifts.map((shift, i) => {
                  const label = `${shift.start} - ${shift.end}`;
                  return (
                    <button
                      key={i}
                      onClick={() => {
                        // 🟢 بجای alert → ریدایرکت به صفحه رزرو
                        router.push(
                          `/reserve/${selectedDoctor.personnelId}?day=${selectedDay}&time=${shift.start}`
                        );
                      }}
                      className="px-3 py-1 rounded bg-gray-200/50 hover:bg-green-500 hover:text-white transition"
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </Modal>
      )}
    </section>
  );
};

export default DoctorsPage;
