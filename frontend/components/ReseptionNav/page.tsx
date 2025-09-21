"use client";
import React, { useEffect, useState } from "react";
import "./style.scss";
import Button from "../Button/page";

interface User {
  name: string;
}

interface ReseptionNavProps {
  patientCount: number;
  user?: User;
}

const ReseptionNav: React.FC<ReseptionNavProps> = ({ patientCount, user }) => {
  const [loginTime, setLoginTime] = useState<string>("");

  useEffect(() => {
    const storedTime = localStorage.getItem("loginTime");
    if (storedTime) {
      setLoginTime(storedTime);
    } else {
      const now = new Date().toLocaleTimeString("fa-IR", {
        hour: "2-digit",
        minute: "2-digit",
      });
      localStorage.setItem("loginTime", now);
      setLoginTime(now);
    }
  }, []);

  return (
    <div className="reseption-nav fixed top-[10px] left-0 right-0 z-50">
      <div className="px-10 flex bg-white w-full py-4 rounded-2xl justify-between items-center shadow-md">
        {user && (
          <div className="nav-item">
            <span>👤 نام کاربر:</span>
            <strong>{user.name}</strong>
          </div>
        )}
        <div className="nav-item">
          <span>🕒 ساعت ورود:</span>
          <strong>{loginTime}</strong>
        </div>
        <div className="nav-item">
          <span>👥 تعداد بیماران:</span>
          <strong>{patientCount}</strong>
        </div>
        <Button name="صدور قبض مجدد" />
      </div>
    </div>
  );
};

export default ReseptionNav;
