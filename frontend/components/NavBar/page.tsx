"use client";

import { useState, useRef } from "react";
import NavItem from "../navItem/page";
import SearchBar from "../SearchBar/page";
import "./style.scss";
import { Menu, CloseSquare } from "iconsax-reactjs";

// تست داده نوبت‌ها
const mockAppointments = [
  { nationalId: "1234567890", doctor: "دکتر علی", day: "شنبه", time: "09:00" },
  {
    nationalId: "1234567890",
    doctor: "دکتر زهرا",
    day: "یک‌شنبه",
    time: "11:00",
  },
  {
    nationalId: "0987654321",
    doctor: "دکتر محمد",
    day: "دوشنبه",
    time: "10:00",
  },
];

const navItems = [
  { name: "بخش دندان پزشکی", link: "/" },
  { name: "آزمایشگاه", link: "/lab" },
  { name: "فیزیوتراپی", link: "/" },
  { name: "چشم پزشکی", link: "/login" },
];

// ================= مودال =================
const Modal = ({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 ">
    <div className="bg-white/90 rounded-xl p-6 w-96 relative backdrop-blur-md">
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

const NavBar = () => {
  const navbarRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  // ======== مودال لغو نوبت ========
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [nationalId, setNationalId] = useState("");
  const [appointments, setAppointments] = useState<typeof mockAppointments>([]);

  const handleCheckAppointments = () => {
    const userAppointments = mockAppointments.filter(
      (a) => a.nationalId === nationalId
    );
    setAppointments(userAppointments);
  };

  return (
    <div
      ref={navbarRef}
      className="navbar fixed top-1 left-1/2 -translate-x-1/2 bg-white/85 flex justify-between items-center w-[95%] rounded-2xl shadow-lg sm:px-6 sm:py-2 md:px-6 py-1 mt-2 z-50"
    >
      {/* SearchBar - visible only on mobile */}
      <div className="flex justify-center items-center gap-10">
        <div className="flex sm:hidden md:flex">
          <h1 className="hidden md:flex">درمانگاه فرهنگیان نیشابور</h1>
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

      {/* Actions (Desktop) */}
      <div className="hidden md:flex items-center gap-3 sm:gap-5">
        <div className="flex justify-center btn px-8 py-3">رزرو نوبت</div>
        <button
          className="flex justify-center  px-8 py-3 bg-amber-300 border rounded-2xl "
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
            className="flex justify-center btn px-8 py-3"
            onClick={() => setShowCancelModal(true)}
          >
            لغو نوبت
          </button>
        </div>
      )}

      {/* مودال لغو نوبت */}
      {showCancelModal && (
        <div className="relative top-1 mt-50">
          <Modal onClose={() => setShowCancelModal(false)}>
            <h2 className="text-lg font-bold mb-4">لغو نوبت</h2>
            <input
              type="text"
              placeholder="شماره ملی خود را وارد کنید"
              value={nationalId}
              onChange={(e) => setNationalId(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-3"
            />
            <button
              onClick={handleCheckAppointments}
              className="w-full bg-blue-600 text-white py-2 rounded mb-3"
            >
              نمایش نوبت‌ها
            </button>

            {appointments.length > 0 ? (
              <ul className="text-gray-700">
                {appointments.map((app, i) => (
                  <li key={i} className="mb-2 border-b border-gray-200 pb-1">
                    {app.doctor} - {app.day} - {app.time}{" "}
                    <button
                      className="text-red-500 mr-2"
                      onClick={() =>
                        setAppointments((prev) =>
                          prev.filter((_, idx) => idx !== i)
                        )
                      }
                    >
                      لغو
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              nationalId && (
                <p className="text-gray-500">
                  نوبتی برای این شماره ملی موجود نیست
                </p>
              )
            )}
          </Modal>
        </div>
      )}
    </div>
  );
};

export default NavBar;
