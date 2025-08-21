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
    { name: "لیست کارکنان", icon: <Home size="20" />, href:"/admin/personnel"},
    { name: "پزشکان", icon: <Home size="20" />, href: "/admin/doctors" },
    { name: "خدمات", icon: <Home size="20" />, href: "/" },
    { name: "حسابداری", icon: <Home size="20" />, href: "/" },
    { name: "دسترسی‌ها", icon: <Home size="20" />, href: "/" },
    { name: "تیکت ها", icon: <Home size="20" />, href: "/" },
  ];

  return (
    <div className="flex">
      {/* Toggle Button */}

      {/* Sidebar */}
      <aside
        className={`bg-white shadow-md flex flex-col transition-all duration-300 ${
          isOpen ? "w-64" : "w-20"
        }`}
      >
        <button
          onClick={toggleSidebar}
          className="p-2 mt-5 bg-gray-200 rounded-md hover:bg-gray-300 w-max mx-auto"
        >
          <Menu size="24" />
        </button>
        <h2
          className={`text-xl font-bold mb-6 p-6 text-right transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
        >
          مدیریت
        </h2>
        <nav className="space-y-2">
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
      </aside>
    </div>
  );
};

export default SideBar;
