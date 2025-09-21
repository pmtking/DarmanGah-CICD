"use client";

import React, { useState } from "react";
import TitleComponents from "@/components/TitleComponents/page";
import Button from "@/components/Button/page";
import toast from "react-hot-toast";
import usePersonel, { CreatePersonnelInput } from "@/hooks/usePersonel";
import "./style.scss";

const AddPersonnelPage: React.FC = () => {
  const { addPersonel } = usePersonel();

  const [form, setForm] = useState<CreatePersonnelInput>({
    name: "",
    nationalId: "",
    phone: "",
    gender: undefined, // optional
    role: "DOCTOR",
    salaryType: "FIXED",
    username: "",
    password: "",
  });

  const [isActive, setIsActive] = useState(true);
  const [hireAt, setHireAt] = useState(new Date().toISOString().slice(0, 10));

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      setIsActive((prev) => !prev);
    } else if (name === "hireAt") {
      setHireAt(value);
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.role) {
      toast.error("لطفاً نقش پرسنل را انتخاب کنید.");
      return;
    }

    try {
      await addPersonel({
        ...form,
        isActive,
        hireAt,
      });
      toast.success("پرسنل با موفقیت اضافه شد!");
    } catch (error) {
      console.error(error);
      toast.error("خطا در افزودن پرسنل");
    }
  };

  return (
    <div className="add-personnel-page">
      <div className="form-wrapper">
        <TitleComponents
          h1="افزودن پرسنل جدید"
          classname="text-center"
          color="#fff"
        />

        <form onSubmit={handleSubmit} className="personnel-form">
          {/* نام و کد ملی */}
          <div className="flex gap-3">
            <input
              type="text"
              name="name"
              placeholder="نام کامل"
              value={form.name}
              onChange={handleChange}
              required
              className="input-style w-full"
            />
            <input
              type="text"
              name="nationalId"
              placeholder="کد ملی"
              value={form.nationalId}
              onChange={handleChange}
              required
              className="input-style w-full"
            />
          </div>

          {/* شماره تماس و نام کاربری */}
          <div className="flex gap-3">
            <input
              type="text"
              name="phone"
              placeholder="شماره تماس"
              value={form.phone}
              onChange={handleChange}
              className="input-style w-full"
            />
            <input
              type="text"
              name="username"
              placeholder="نام کاربری"
              value={form.username}
              onChange={handleChange}
              required
              className="input-style w-full"
            />
          </div>

          {/* رمز عبور */}
          <input
            type="password"
            name="password"
            placeholder="رمز عبور"
            value={form.password}
            onChange={handleChange}
            required
            className="input-style w-full"
          />

          {/* جنسیت و نقش */}
          <div className="flex gap-3">
            <select
              name="gender"
              value={form.gender || ""}
              onChange={handleChange}
              className="input-style w-full"
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
              className="input-style w-full"
            >
              <option value="DOCTOR">پزشک</option>
              <option value="NURSE">پرستار</option>
              <option value="RECEPTION">پذیرش</option>
              <option value="MANAGER">مدیر</option>
              <option value="SERVICE">خدمات</option>
            </select>
          </div>

          {/* نوع حقوق */}
          <select
            name="salaryType"
            value={form.salaryType}
            onChange={handleChange}
            className="input-style w-full"
          >
            <option value="FIXED">حقوق ثابت</option>
            <option value="PERCENTAGE">درصدی</option>
          </select>

          {/* فعال بودن */}
          <label className="checkbox">
            <input
              type="checkbox"
              name="isActive"
              checked={isActive}
              onChange={handleChange}
            />
            فعال باشد
          </label>

          {/* تاریخ استخدام */}
          <input
            type="date"
            name="hireAt"
            value={hireAt}
            onChange={handleChange}
            className="input-style w-full"
          />

          <Button type="submit" name="ثبت پرسنل" />
        </form>
      </div>
    </div>
  );
};

export default AddPersonnelPage;
