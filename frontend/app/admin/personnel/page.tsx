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
  nationalId: string;
  username?: string;
}

interface ApiResponse {
  success: boolean;
  data: Personnel[];
}

const PersonnelsPage: React.FC = () => {
  const [personnels, setPersonnels] = useState<Personnel[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");

  // 📌 برای مدال و آپدیت
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editPersonnel, setEditPersonnel] = useState<Personnel | null>(null);

  const [newName, setNewName] = useState<string>("");
  const [newNationalId, setNewNationalId] = useState<string>("");
  const [newUsername, setNewUsername] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");

  const fetchPersonnels = async () => {
    setLoading(true);
    try {
      const res = await api.get<ApiResponse>("/api/personel/find");
      setPersonnels(res.data.data);
    } catch (error) {
      console.error("❌ خطا در دریافت پرسنل‌ها:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPersonnels();
  }, []);

  const filteredPersonnels = personnels.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  // 📌 حذف پرسنل
  const handleDelete = async (id: string) => {
    if (!confirm("آیا مطمئن هستید که می‌خواهید این پرسنل را حذف کنید؟")) return;

    try {
      await api.delete(`/api/personel/${id}`);
      setPersonnels((prev) => prev.filter((p) => p._id !== id));
      alert("✅ پرسنل با موفقیت حذف شد.");
    } catch (error) {
      console.error("❌ خطا در حذف پرسنل:", error);
      alert("خطا در حذف پرسنل!");
    }
  };

  // 📌 باز کردن مدال ویرایش
  const openUpdateModal = (person: Personnel) => {
    setEditPersonnel(person);
    setNewName(person.name);
    setNewNationalId(person.nationalId);
    setNewUsername(person.username || "");
    setNewPassword("");
    setIsModalOpen(true);
  };

  // 📌 ذخیره تغییرات
  const handleSaveUpdate = async () => {
    if (!editPersonnel) return;

    try {
      const res = await api.put(`/api/personel/${editPersonnel._id}`, {
        name: newName,
        nationalId: newNationalId,
        username: newUsername,
        password: newPassword || undefined, // فقط اگه چیزی وارد شد
      });

      setPersonnels((prev) =>
        prev.map((p) =>
          p._id === editPersonnel._id
            ? { ...p, name: res.data.data.name, nationalId: res.data.data.nationalId }
            : p
        )
      );

      setIsModalOpen(false);
      setEditPersonnel(null);
      alert("✅ پرسنل با موفقیت ویرایش شد.");
    } catch (error) {
      console.error("❌ خطا در ویرایش پرسنل:", error);
      alert("خطا در ویرایش پرسنل!");
    }
  };

  // 📌 نمایش مدارک پرسنل (فعلاً فقط console)
  const handleViewDocuments = (id: string) => {
    console.log("📄 مشاهده مدارک پرسنل با شناسه:", id);
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
                onUpdate={() => openUpdateModal(person)}
                onViewDocuments={() => handleViewDocuments(person._id)}
              />
            ))
          )}
        </div>
      </main>

      {/* 📌 مدال ویرایش */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-[400px]">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              ویرایش پرسنل
            </h2>

            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="نام"
              className="w-full border px-3 py-2 rounded-lg mb-3"
            />
            <input
              type="text"
              value={newNationalId}
              onChange={(e) => setNewNationalId(e.target.value)}
              placeholder="کد ملی"
              className="w-full border px-3 py-2 rounded-lg mb-3"
            />
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="نام کاربری"
              className="w-full border px-3 py-2 rounded-lg mb-3"
            />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="رمز عبور جدید (اختیاری)"
              className="w-full border px-3 py-2 rounded-lg mb-4"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
              >
                انصراف
              </button>
              <button
                onClick={handleSaveUpdate}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                ذخیره
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonnelsPage;
