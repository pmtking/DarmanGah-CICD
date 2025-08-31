"use client";
import Button from "@/components/Button/page";
import PersonelCard from "@/components/PersonelCard/page";
import TitleComponents from "@/components/TitleComponents/page";
import React from "react";

const PersonelsPage: React.FC = () => {
  // توابع هندل‌کننده
  const handleDelete = (id: string) => {
    console.log("حذف پرسنل با شناسه:", id);
  };

  const handleUpdate = (id: string) => {
    console.log("ویرایش پرسنل با شناسه:", id);
  };

  const handleViewDocuments = (id: string) => {
    console.log("مشاهده مدارک پرسنل با شناسه:", id);
  };

  return (
    <div className="w-full min-h-screen bg-gray-400/40 rounded-2xl mt-5 px-5 py-2 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center w-full px-10 py-4">
        <TitleComponents h1="پرسنل" color="#fff" classname="flex" />
        <div className="flex w-[40%] gap-6">
          <input
            type="text"
            className="border w-full border-white outline-0 rounded-lg px-3 py-2 placeholder:text-sm bg-gray-400/50 text-white"
            placeholder="جستجو کاربر"
          />
          <Button name="افزودن کاربر" as="link" href="/admin/personnel/add" />
        </div>
      </div>

      {/* Content */}
      <main className="flex-grow bg-white rounded-2xl shadow-2xl px-10 py-4 overflow-y-auto">
        <div className="flex flex-col gap-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <PersonelCard
              key={i}
              name="وهاب حسین‌ آبادی"
              role="پذیرش"
              onDelete={() => handleDelete(`person-${i}`)}
              onUpdate={() => handleUpdate(`person-${i}`)}
              onViewDocuments={() => handleViewDocuments(`person-${i}`)}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default PersonelsPage;
