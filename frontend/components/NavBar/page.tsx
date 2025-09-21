"use client";

import { useState, useRef } from "react";
import NavItem from "../navItem/page";
import SearchBar from "../SearchBar/page";
import "./style.scss";
import { Menu, CloseSquare } from "iconsax-reactjs";

const navItems = [
  { name: "بخش دندان پزشکی", link: "/" },
  { name: "آزمایشگاه", link: "/lab" },
  { name: "فیزیوتراپی", link: "/" },
  { name: "چشم پزشکی", link: "/login" },
];

const NavBar = () => {
  const navbarRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      ref={navbarRef}
      className="navbar fixed top-1 left-1/2 -translate-x-1/2 bg-white/85 flex justify-between items-center w-[95%] rounded-2xl shadow-lg sm:px-6 sm:py-2 md:px-6 py-1 mt-2 z-50"
    >
      {/* SearchBar - visible only on mobile */}
      <div className="flex justify-center items-center gap-10">
        <div className="flex sm:hidden md:flex  ">
          <h1 className="hidden md:flex">درمانگاه فرهنگیان نیشابور</h1>
        </div>
        <div className="md:hidden flex-1 lg:flex ">
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
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center ml-2">
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <CloseSquare size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu - فقط برای آیکن باز و بسته */}
      {isOpen && (
        <div className="absolute top-14 left-0 w-full bg-white rounded-b-2xl shadow-lg flex flex-col items-center gap-4 py-5 md:hidden animate-fadeIn">
          {/* می‌تونید در صورت نیاز آیتم‌های دیگر را اینجا اضافه کنید */}
        </div>
      )}
    </div>
  );
};

export default NavBar;
