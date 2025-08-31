"use client";
import React, { useState } from "react";
import { Home, Menu } from "iconsax-reactjs";
import NavItem from "../navItem/page";

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const navItems = [
    { name: "داشبورد", icon: <Home size="20" />, href: "/admin" },
    {
      name: "لیست کارکنان",
      icon: <Home size="20" />,
      href: "/admin/personnel",
    },
    { name: "پزشکان", icon: <Home size="20" />, href: "/admin/doctors" },
    { name: "خدمات", icon: <Home size="20" />, href: "/" },
    { name: "حسابداری", icon: <Home size="20" />, href: "/" },
    { name: "دسترسی‌ها", icon: <Home size="20" />, href: "/" },
    { name: "تیکت ها", icon: <Home size="20" />, href: "/" },
  ];

  return (
    <div className="flex h-[95vh]">
      {/* Sidebar */}
      <aside
        className={`bg-white shadow-md flex flex-col justify-between transition-all duration-300 rounded-2xl ${
          isOpen ? "w-64" : "w-20"
        }`}
      >
        <div>
          {/* Sidebar Header with Toggle */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            {isOpen && (
              <h2 className="text-lg font-semibold text-gray-700 transition-all duration-300">
                مدیریت
              </h2>
            )}
            <button
              onClick={toggleSidebar}
              className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
            >
              <Menu size="22" />
            </button>
          </div>

          {/* Nav Items */}
          <nav className="space-y-2 mt-4">
            {navItems.map((item, index) => (
              <NavItem
                key={index}
                variant="sidebar"
                name={isOpen ? item.name : ""}
                icon={item.icon}
                link={item.href}
              />
            ))}
          </nav>
        </div>

        {/* تبلیغ */}
        <div className="m-4 p-3 bg-amber-100 rounded-lg shadow-sm text-center cursor-pointer hover:bg-amber-200 transition">
          <p className="text-sm font-medium text-gray-800">🎉 تخفیف ویژه خدمات درمانی</p>
          {isOpen && <span className="text-xs text-gray-600">کلیک کنید</span>}
        </div>
      </aside>
    </div>
  );
};

export default SideBar;