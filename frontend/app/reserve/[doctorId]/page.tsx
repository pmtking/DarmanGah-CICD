"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/libs/axios";

// ----------------- Types -----------------
interface Shift {
  start: string;
  end: string;
  booked?: string[];
}

interface Doctor {
  personnelId: string;
  _id: string;
  name: string;
  specialty: string;
  specialtyType: string;
  email?: string;
  workingDays: string[];
  workingHours: Record<string, { shifts: Shift[] }>;
  avatarUrl?: string;
}

// ----------------- Modal Component -----------------
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

// ----------------- Doctors Page -----------------
const DoctorsPage = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const router = useRouter();
  const params = useParams();
  const typeSlug = typeof params?.type === "string" ? params.type.trim() : undefined;

  // ----------------- Specialty Mapping -----------------
  const typeMap: Record<string, { label: string; specialtyTypes: string[] }> = {
    general: { label: "عمومی", specialtyTypes: ["پزشک عمومی"] },
    dentist: { label: "دندان‌پزشکی", specialtyTypes: ["دندان‌پزشکی"] },
    specialist: {
      label: "متخصص",
      specialtyTypes: [
        "جراح عمومی", "جراح مغز و اعصاب", "جراح قلب", "جراح ارتوپد",
        "داخلی", "اطفال", "پوست و مو", "رادیولوژی", "مامائی",
        "اورولوژی", "روان‌شناسی", "تغذیه", "زنان و زایمان",
        "قلب و عروق", "گوارش", "فیزیوتراپی", "عفونی", "بیهوشی",
        "چشم‌پزشکی", "گوش و حلق و بینی", "طب اورژانس", "طب کار",
        "طب فیزیکی و توانبخشی", "سایر"
      ]
    },
  };

  // ----------------- Fetch Doctors -----------------
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await api.get<Doctor[]>("/api/doctors");
        setDoctors(res.data || []);
      } catch (err) {
        console.error("Error fetching doctors:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  if (loading)
    return <p className="text-center mt-10 text-gray-600">Loading doctors...</p>;

  // ----------------- Filter Doctors -----------------
  const filteredDoctors = typeSlug
    ? doctors.filter((doc) =>
        typeMap[typeSlug]?.specialtyTypes.includes(doc.specialtyType)
      )
    : doctors; // اگر typeSlug وجود نداشت، همه دکترها نمایش داده شوند

  return (
    <section className="p-6 doctors-page">
      <h1 className="text-3xl font-bold mb-8 text-center text-white">
        {typeSlug
          ? `List of ${typeMap[typeSlug]?.label || typeSlug}`
          : "All Doctors"}
      </h1>

      {filteredDoctors.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">
          No doctors found for this category
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
                  No Photo
                </div>
              )}

              <h3 className="text-xl font-semibold mb-1 text-center text-white">{doctor.name}</h3>
              <p className="text-blue-300 font-medium mb-3 text-center">{doctor.specialty}</p>

              <div className="w-full mb-3">
                <p className="text-sm font-bold text-white">Working Days:</p>
                <p className="text-sm text-gray-200">{doctor.workingDays?.join(" ، ") || "-"}</p>
              </div>

              <button
                onClick={() => {
                  setSelectedDoctor(doctor);
                  setSelectedDay(null);
                  setShowModal(true);
                }}
                className="w-full bg-blue-600/70 text-white py-2 rounded-xl hover:bg-blue-700/80 transition font-medium backdrop-blur-sm"
              >
                Book Appointment
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ----------------- Modal ----------------- */}
      {showModal && selectedDoctor && (
        <Modal onClose={() => setShowModal(false)}>
          <h4 className="font-bold text-gray-800 mb-2">Select Day:</h4>
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
              <h4 className="font-bold text-gray-800 mb-2">Select Time:</h4>
              <div className="flex flex-wrap gap-2">
                {selectedDoctor.workingHours[selectedDay]?.shifts.map((shift, i) => (
                  <button
                    key={i}
                    onClick={() =>
                      router.push(
                        `/reserve/${selectedDoctor.personnelId}?day=${selectedDay}`
                      )
                    }
                    className="px-3 py-1 rounded bg-gray-200/50 hover:bg-green-500 hover:text-white transition"
                  >
                    {shift.start} - {shift.end}
                  </button>
                ))}
              </div>
            </>
          )}
        </Modal>
      )}
    </section>
  );
};

export default DoctorsPage;
