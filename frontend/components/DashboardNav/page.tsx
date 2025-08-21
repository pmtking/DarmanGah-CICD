"use client";

import React, { useState } from "react";
import "./style.scss";
import defaultImage from "@/public/images/image 8.png";
import Image from "next/image";
import { Notification } from "iconsax-reactjs";
import NotificationModal from "../NotificationModal/page";

interface UserType {
  name?: string;
  image?: string;
}

const DashboardNav = ({ user }: any) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <main className="w-full px-5 py-3 bg-white mt-3 rounded-2xl flex justify-between items-center">
        <h1 className="text-xl font-bold">داشبورد</h1>
        <div className="flex items-center gap-3">
          <div
            className="notife cursor-pointer"
            onClick={() => setShowModal(true)}
          >
            <span>10</span>
            <Notification />
          </div>
          <Image
            src={user.image || defaultImage}
            alt="User Avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
          <span className="text-sm font-medium">
            {user.name || "کاربر مهمان"}
          </span>
        </div>
      </main>
      <NotificationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
};

export default DashboardNav;
