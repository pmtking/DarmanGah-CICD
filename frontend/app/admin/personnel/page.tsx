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
  avatar?: string; // ← اضافه شد
}

interface ApiResponse {
  success: boolean;
  data: Personnel[];
}

const PersonnelsPage: React.FC = () => {
  const [personnels, setPersonnels] = useState<Personnel[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  // مدال و ویرایش
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editPersonnel, setEditPersonnel] = useState<Personnel | null>(null);

  const [newName, setNewName] = useState("");
  const [newNationalId, setNewNationalId] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPhoto, setNewPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");

  const fetchPersonnels = async () => {
    setLoading(true);
    try {
      const res = await api.get<ApiResponse>("/api/personel/find");
      setPersonnels(res.data.data);
    } catch (err) {
      console.error("❌ خطا در دریافت پرسنل‌ها:", err);
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

  const handleDelete = async (id: string) => {
    if (!confirm("آیا مطمئن هستید که می‌خواهید این پرسنل را حذف کنید؟")) return;
    try {
      await api.delete(`/api/personel/${id}`);
      setPersonnels((prev) => prev.filter((p) => p._id !== id));
      alert("✅ پرسنل با موفقیت حذف شد.");
    } catch (err) {
      console.error("❌ خطا در حذف پرسنل:", err);
      alert("خطا در حذف پرسنل!");
    }
  };

  const openUpdateModal = (person: Personnel) => {
    setEditPersonnel(person);
    setNewName(person.name);
    setNewNationalId(person.nationalId);
    setNewUsername(person.username || "");
    setNewPassword("");
    setPhotoPreview(
      person.avatar
        ? `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}${person.avatar}`
        : ""
    );
    setNewPhoto(null);
    setIsModalOpen(true);
  };

  const handlePhotoChange = (file: File | null) => {
    setNewPhoto(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPhotoPreview(
        editPersonnel?.avatar
          ? `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}${editPersonnel.avatar}`
          : ""
      );
    }
  };

  const handleSaveUpdate = async () => {
    if (!editPersonnel) return;

    try {
      const formData = new FormData();
      formData.append("name", newName);
      formData.append("nationalId", newNationalId);
      formData.append("username", newUsername);
      if (newPassword) formData.append("password", newPassword);
      if (newPhoto) formData.append("photo", newPhoto);

      const res = await api.put(`/api/personel/${editPersonnel._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setPersonnels((prev) =>
        prev.map((p) => (p._id === editPersonnel._id ? res.data.data : p))
      );

      setIsModalOpen(false);
      setEditPersonnel(null);
      setNewPhoto(null);
      setPhotoPreview("");
      alert("✅ پرسنل با موفقیت ویرایش شد.");
    } catch (err) {
      console.error("❌ خطا در ویرایش پرسنل:", err);
      alert("خطا در ویرایش پرسنل!");
    }
  };

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
      <main className="flex-grow backdrop-blur-2xl bg-white/10 rounded-2xl border border-white/20 shadow-2xl px-10 py-4 overflow-y-auto mt-5 max-h-[650px] scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-transparent hover:scrollbar-thumb-white/50 transition-colors">
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
                imageUrl={person.avatar} // ← حالا TS قبول می‌کند
              />
            ))
          )}
        </div>
      </main>

      {/* Modal ویرایش */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-[400px]">
            <h2 className="text-xl font-bold mb-4 text-gray-800">ویرایش پرسنل</h2>

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
              className="w-full border px-3 py-2 rounded-lg mb-3"
            />

            <div className="mb-3">
              <label className="block mb-1 text-gray-700">عکس پروفایل</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handlePhotoChange(e.target.files ? e.target.files[0] : null)
                }
                className="w-full"
              />
              {photoPreview && (
                <img
                  src={photoPreview}
                  alt="پیش‌نمایش عکس"
                  className="mt-2 w-24 h-24 object-cover rounded-full border"
                />
              )}
            </div>

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
