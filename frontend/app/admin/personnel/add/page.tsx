"use client";
import React, { useState } from "react";
import TitleComponents from "@/components/TitleComponents/page";
import Button from "@/components/Button/page";

const AddPersonnelPage = () => {
  const [form, setForm] = useState({
    name: "",
    nationalId: "",
    phone: "",
    gender: "",
    role: "",
    salaryType: "FIXED",
    isActive: true,
    hireAt: new Date().toISOString().slice(0, 10),
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
  };  

  return (
    <div className="w-full h-full rounded-2xl mt-5 px-10 py-6">
      <TitleComponents h1="افزودن پرسنل جدید" color="#fff" />

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 mt-8 w-full max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-md"
      >
        <input
          type="text"
          name="name"
          placeholder="نام کامل"
          value={form.name}
          onChange={handleChange}
          required
          className="border border-gray-300 rounded-lg px-4 py-2"
        />

        <input
          type="text"
          name="nationalId"
          placeholder="کد ملی"
          value={form.nationalId}
          onChange={handleChange}
          required
          className="border border-gray-300 rounded-lg px-4 py-2"
        />

        <input
          type="text"
          name="phone"
          placeholder="شماره تماس"
          value={form.phone}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg px-4 py-2"
        />

        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
          required
          className="border border-gray-300 rounded-lg px-4 py-2"
        >
          <option value="">جنسیت</option>
          <option value="MALE">مرد</option>
          <option value="FEMALE">زن</option>
          <option value="OTHER">سایر</option>
        </select>

        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          required
          className="border border-gray-300 rounded-lg px-4 py-2"
        >
          <option value="">نقش</option>
          <option value="DOCTOR">پزشک</option>
          <option value="NURSE">پرستار</option>
          <option value="RECEPTION">پذیرش</option>
          <option value="MANAGER">مدیر</option>
          <option value="SERVICE">خدمات</option>
        </select>

        <select
          name="salaryType"
          value={form.salaryType}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg px-4 py-2"
        >
          <option value="FIXED">حقوق ثابت</option>
          <option value="PERCENTAGE">درصدی</option>
        </select>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isActive"
            checked={form.isActive}
            onChange={handleChange}
          />
          فعال باشد
        </label>

        <input
          type="date"
          name="hireAt"
          value={form.hireAt}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg px-4 py-2"
        />

        <Button name="ثبت پرسنل" type="submit" />
      </form>
    </div>
  );
};

export default AddPersonnelPage;
