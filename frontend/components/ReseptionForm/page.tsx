"use client";

import React, { useState, useEffect } from "react";
import Input from "../Input/page";
import Button from "../Button/page";
import toast from "react-hot-toast";

type ReseptionFormProps = {
  data?: any;
};

const doctorsServices: Record<string, string[]> = {
  "دکتر احمدی": ["معاینه عمومی", "نوار قلب", "تزریقات"],
  "دکتر رضایی": ["جراحی سرپایی", "بخیه", "پانسمان"],
  "دکتر محمدی": ["ارتوپدی", "شکسته‌بندی", "فیزوتراپی"],
};

type DoctorName = "دکتر احمدی" | "دکتر رضایی" | "دکتر محمدی";

type ServiceItem = { name: string; quantity: number };

type FormData = {
  firstName: string;
  lastName: string;
  gender: string;
  doctorName: DoctorName | "";
  visitDate: string;
  insuranceType: string;
  supplementaryInsurance: string;
  relation: string;
  phoneNumber: string;
  service: string;
};

const ReseptionForm = ({ data }: ReseptionFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    gender: "",
    doctorName: "",
    visitDate: "",
    insuranceType: "",
    supplementaryInsurance: "",
    relation: "",
    phoneNumber: "",
    service: "",
  });

  const [availableServices, setAvailableServices] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedServices, setSelectedServices] = useState<ServiceItem[]>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addService = (service: string) => {
    if (!selectedServices.find((s) => s.name === service)) {
      setSelectedServices([...selectedServices, { name: service, quantity: 1 }]);
      setSearchQuery("");
      setFormData((prev) => ({ ...prev, service: "" }));
    } else {
      toast.error("این خدمت قبلا انتخاب شده است");
    }
  };

  const updateQuantity = (service: string, quantity: number) => {
    setSelectedServices((prev) =>
      prev.map((s) => (s.name === service ? { ...s, quantity } : s))
    );
  };

  const removeService = (service: string) => {
    setSelectedServices((prev) => prev.filter((s) => s.name !== service));
  };

  useEffect(() => {
    if (formData.doctorName && doctorsServices[formData.doctorName]) {
      setAvailableServices(doctorsServices[formData.doctorName]);
    } else {
      setAvailableServices([]);
      setSelectedServices([]);
    }
  }, [formData.doctorName]);

  useEffect(() => {
    if (data) {
      let firstName = "";
      let lastName = "";
      if (data.fullName) {
        const parts = data.fullName.split(" ");
        firstName = parts[0] || "";
        lastName = parts.slice(1).join(" ") || "";
      }

      setFormData((prev) => ({
        ...prev,
        firstName,
        lastName,
        phoneNumber: data.phoneNumber || "",
        insuranceType: data.insuranceType || "",
      }));
    }
  }, [data]);

  return (
    <div className="flex flex-col justify-center items-center p-4">
      {/* نام و نام خانوادگی و جنسیت */}
      <div className="flex justify-between w-full gap-3">
        <div className="flex flex-col w-full">
          <label className="text-right text-gray-700">نام</label>
          <Input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full py-2 px-4 mb-4 border border-gray-400 rounded text-black"
          />
        </div>
        <div className="flex flex-col w-full">
          <label className="text-right text-gray-700">نام خانوادگی</label>
          <Input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full py-2 px-4 mb-4 border border-gray-400 rounded text-black"
          />
        </div>
        <div className="flex flex-col w-full">
          <label className="text-right text-gray-700">جنسیت</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full rounded-xl py-2 px-4 mb-4 border border-gray-400 text-black"
          >
            <option value="">جنسیت</option>
            <option value="مرد">مرد</option>
            <option value="زن">زن</option>
          </select>
        </div>
      </div>

      {/* نسبت با سرپرست و شماره تماس */}
      <div className="flex justify-between w-full gap-3">
        <div className="flex flex-col w-full">
          <label className="text-right text-gray-700">نسبت با سرپرست</label>
          <Input
            type="text"
            name="relation"
            value={formData.relation}
            onChange={handleChange}
            className="w-full py-2 px-4 mb-4 border border-gray-400 rounded text-black"
          />
        </div>
        <div className="flex flex-col w-full">
          <label className="text-right text-gray-700">شماره تماس</label>
          <Input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="w-full py-2 px-4 mb-4 border border-gray-400 rounded text-black"
          />
        </div>
      </div>

      {/* انتخاب پزشک */}
      <div className="flex flex-col w-full mb-4">
        <label className="text-right text-gray-700">نام پزشک</label>
        <select
          name="doctorName"
          value={formData.doctorName}
          onChange={handleChange}
          className="w-full py-2 px-4 border border-gray-400 rounded text-black"
        >
          <option value="">انتخاب پزشک</option>
          {Object.keys(doctorsServices).map((d, i) => (
            <option key={i} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      {/* خدمات */}
      {availableServices.length > 0 && (
        <div className="flex flex-col w-full relative mb-4">
          <label className="text-right text-gray-700">خدمات</label>
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجوی خدمات..."
            className="w-full py-2 px-4 mb-2 border border-gray-400 rounded text-black"
          />
          {searchQuery && (
            <ul className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded max-h-40 overflow-y-auto z-10">
              {availableServices
                .filter((s) =>
                  s.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((s, i) => (
                  <li
                    key={i}
                    onClick={() => addService(s)}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-black"
                  >
                    {s}
                  </li>
                ))}
            </ul>
          )}
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedServices.map((s, i) => (
              <div
                key={i}
                className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
              >
                <span>{s.name}</span>
                <input
                  type="number"
                  min={1}
                  value={s.quantity}
                  onChange={(e) => updateQuantity(s.name, Number(e.target.value))}
                  className="w-12 px-1 py-0.5 border rounded text-xs text-black"
                />
                <button
                  onClick={() => removeService(s.name)}
                  className="text-red-500 font-bold px-1"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* دکمه‌ها */}
      <div className="flex w-full gap-4 mt-5">
        <Button name="ثبت اطلاعات" />
        <button className="w-full bg-gray-500 text-white rounded-lg py-2">
          صرف نظر از پذیرش
        </button>
      </div>
    </div>
  );
};

export default ReseptionForm;
