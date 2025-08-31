"use client";
import React, { useState } from "react";
import TitleComponents from "@/components/TitleComponents/page";
import Button from "@/components/Button/page";

interface PersonnelForm {
  name: string;
  nationalId: string;
  phone: string;
  gender: "MALE" | "FEMALE" | "OTHER" | "";
  role: "DOCTOR" | "NURSE" | "RECEPTION" | "MANAGER" | "SERVICE" | "";
  salaryType: "FIXED" | "PERCENTAGE";
  isActive: boolean;
  hireAt: string;
}

const AddPersonnelPage: React.FC = () => {
  const [form, setForm] = useState<PersonnelForm>({
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
    const { name, value, type } = e.target;

    const newValue =
      type === "checkbox" && e.target instanceof HTMLInputElement
        ? e.target.checked
        : value;

    setForm((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // اینجا می‌تونی داده‌ها رو به API ارسال کنی
      console.log("فرم ارسال شد:", form);
    } catch (error) {
      console.error("خطا در ارسال فرم:", error);
    }
  };

  return (
    <div className="w-full h-full rounded-2xl mt-5 px-10 py-6">
      <TitleComponents h1="افزودن پرسنل جدید" color="#fff" classname="flex" />

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
