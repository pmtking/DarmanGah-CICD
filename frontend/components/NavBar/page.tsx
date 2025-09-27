"use client";

import { useState, useRef } from "react";
import NavItem from "../navItem/page";
import SearchBar from "../SearchBar/page";
import { Menu, CloseSquare } from "iconsax-reactjs";
import api from "@/libs/axios";

const navItems = [
  { name: "بخش دندان پزشکی", link: "/" },
  { name: "آزمایشگاه", link: "/lab" },
  { name: "فیزیوتراپی", link: "/" },
  { name: "چشم پزشکی", link: "/login" },
];

const NavBar = () => {
  const navbarRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  // Modal states
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [nationalId, setNationalId] = useState("");
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // دریافت نوبت‌ها
  const handleCheckAppointments = async () => {
    if (!nationalId) return;
    try {
      setLoading(true);
      const res = await api.post("api/appointment/find", {
        nationalCode: nationalId,
      });
      const activeAppointments = (res.data.data || []).filter(
        (a: any) =>
          a.status !== "cancelled" && a.status !== "لغو" && !a.isCanceled
      );
      setAppointments(activeAppointments);
    } catch (err) {
      console.error(err);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  // لغو نوبت
  const handleCancelAppointment = async (appointmentId: string) => {
    try {
      const res = await api.post("api/appointment/cancel-by-code", {
        nationalCode: nationalId,
        appointmentId,
      });
      if (res.data.success) {
        setAppointments((prev) => prev.filter((a) => a._id !== appointmentId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative">
      {/* Navbar */}
      <div
        ref={navbarRef}
        className="fixed top-1 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md flex justify-between items-center w-[95%] rounded-2xl shadow-lg sm:px-6 sm:py-2 md:px-6 py-1 mt-2 z-50"
      >
        {/* Logo / Title */}
        <div className="flex justify-center items-center gap-6">
          <div className="flex sm:hidden md:flex">
            <h1 className="hidden md:flex text-lg font-bold text-gray-700">
              درمانگاه فرهنگیان نیشابور
            </h1>
          </div>
          <div className="md:hidden flex-1 lg:flex">
            <SearchBar />
          </div>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex mx-auto justify-center gap-10">
          {navItems.map((item) => (
            <NavItem key={item.name} name={item.name} link={item.link} />
          ))}
        </div>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-3 sm:gap-5">
          <button
            className="px-6 py-2 rounded-xl bg-[#facc15] text-white shadow hover:bg-red-600 transition"
            onClick={() => setShowCancelModal(true)}
          >
            لغو نوبت
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center ml-2">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <CloseSquare size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="absolute top-14 left-0 w-full bg-white rounded-b-2xl shadow-lg flex flex-col items-center gap-4 py-5 md:hidden animate-fadeIn">
            {navItems.map((item) => (
              <NavItem key={item.name} name={item.name} link={item.link} />
            ))}
            <button
              className="px-6 py-2 bg-red-500 text-white rounded-xl shadow hover:bg-red-600 transition"
              onClick={() => setShowCancelModal(true)}
            >
              لغو نوبت
            </button>
          </div>
        )}
      </div>

      {/* Modal لغو نوبت */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md animate-fadeIn relative">
            <button
              onClick={() => setShowCancelModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-xl"
            >
              ×
            </button>

            <h2 className="text-xl font-bold mb-4 text-center text-gray-800">
              لغو نوبت
            </h2>
            <input
              type="text"
              placeholder="شماره ملی خود را وارد کنید"
              value={nationalId}
              onChange={(e) => setNationalId(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded mb-4 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            <button
              onClick={handleCheckAppointments}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded mb-4 transition"
            >
              {loading ? "در حال بارگذاری..." : "نمایش نوبت‌ها"}
            </button>

            {appointments.length > 0 ? (
              <ul className="space-y-3 max-h-64 overflow-y-auto">
                {appointments.map((app) => (
                  <li
                    key={app._id}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg shadow-sm"
                  >
                    <div>
                      <p className="font-bold text-gray-700">
                        {app.doctorId?.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {app.appointmentDate} - {app.appointmentTime}
                      </p>
                    </div>
                    <button
                      className="text-red-600 font-semibold hover:underline"
                      onClick={() => handleCancelAppointment(app._id)}
                    >
                      لغو
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              nationalId &&
              !loading && (
                <p className="text-gray-500 text-center">
                  نوبتی برای این شماره ملی موجود نیست
                </p>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NavBar;
