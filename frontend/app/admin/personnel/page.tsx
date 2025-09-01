"use client";
import React, { useEffect, useState } from "react";
import Button from "@/components/Button/page";
import PersonelCard from "@/components/PersonelCard/page";
import TitleComponents from "@/components/TitleComponents/page";
import api from "@/libs/axios";
import "./style.scss";

interface Personnel {
  _id: string;
  name: string;
  role: string;
  // می‌توانید فیلدهای بیشتری اضافه کنید
}

const PersonnelsPage: React.FC = () => {
  const [personnels, setPersonnels] = useState<Personnel[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");

  // دریافت لیست پرسنل‌ها
  const fetchPersonnels = async () => {
    setLoading(true);
    try {
      const res = await api.get<Personnel[]>("/api/personel/find");
      setPersonnels(res.data.data); // فقط res.data چون خودش آرایه است
    } catch (error) {
      console.error("خطا در دریافت پرسنل‌ها:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPersonnels();
  }, []);

  // فیلتر بر اساس جستجو
  const filteredPersonnels = personnels.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

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
    <div className="w-full rounded-2xl mt-5 px-5 py-2 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center w-full px-10 py-4 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-lg">
        <TitleComponents h1="پرسنل" color="#fff" classname="flex" />
        <div className="flex w-[40%] gap-4">
          <input
            type="text"
            className="border w-full border-white/30 outline-0 rounded-lg px-3 py-2 placeholder:text-sm bg-white/10 text-white backdrop-blur-md"
            placeholder="جستجو کاربر"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button name="افزودن کاربر" as="link" href="/admin/personnel/add" />
        </div>
      </div>

      {/* Content */}
      <main
        className="flex-grow backdrop-blur-2xl bg-white/10 rounded-2xl border border-white/20 shadow-2xl px-10 py-4 overflow-y-auto mt-5 max-h-[650px] 
  scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-transparent hover:scrollbar-thumb-white/50 transition-colors"
      >
        <div className="flex flex-col gap-4">
          {loading ? (
            <p className="text-white text-center py-4">در حال بارگذاری...</p>
          ) : filteredPersonnels.length === 0 ? (
            <p className="text-white text-center py-4">هیچ پرسنلی یافت نشد.</p>
          ) : (
            filteredPersonnels.map((person) => (
              <PersonelCard
                key={person._id}
                name={person.name}
                role={person.role}
                onDelete={() => handleDelete(person._id)}
                onUpdate={() => handleUpdate(person._id)}
                onViewDocuments={() => handleViewDocuments(person._id)}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default PersonnelsPage;
