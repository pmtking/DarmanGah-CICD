"use client";

import React, { useState, useEffect } from "react";
import Input from "../Input/page";
import Button from "../Button/page";
import toast from "react-hot-toast";

type ReseptionFormProps = {
  data?: any;
  nationalId: string;
  onSubmit: (payload: any) => void;
};

type ServiceItem = { _id: string; serviceName: string; price: number; quantity: number };
type DoctorItem = { _id: string; fullName: string };

type FormData = {
  firstName: string;
  lastName: string;
  gender: string;
  doctorId: string;
  visitDate: string;
  insuranceType: string;
  supplementaryInsurance: string;
  relation: string;
  phoneNumber: string;
};

const ReseptionForm = ({ data, nationalId, onSubmit }: ReseptionFormProps) => {
  const today = new Date().toISOString().split("T")[0];
  const defaultTime = new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    gender: "",
    doctorId: "",
    visitDate: today,
    insuranceType: "سایر",
    supplementaryInsurance: "سایر",
    relation: "",
    phoneNumber: "",
  });

  const [allServices, setAllServices] = useState<ServiceItem[]>([]);
  const [allDoctors, setAllDoctors] = useState<DoctorItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedServices, setSelectedServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    fetch("http://192.171.1.16:4000/api/service/")
      .then(res => res.json())
      .then(data =>
        setAllServices(data.map((s: any) => ({ _id: s._id, serviceName: s.serviceName, price: s.price || 0, quantity: 1 })))
      )
      .catch(err => console.error("خطا در دریافت خدمات:", err));
  }, []);

  useEffect(() => {
    fetch("http://192.171.1.16:4000/api/doctors/")
      .then(res => res.json())
      .then(data => setAllDoctors(data.map((d: any) => ({ _id: d.personnelId, fullName: d.name }))))
      .catch(err => console.error("خطا در دریافت پزشکان:", err));
  }, []);

  const addService = (service: ServiceItem) => {
    if (!selectedServices.find(s => s._id === service._id)) {
      setSelectedServices([...selectedServices, { ...service, quantity: 1 }]);
      setSearchQuery("");
    } else toast.error("این خدمت قبلا انتخاب شده است");
  };

  const updateQuantity = (_id: string, quantity: number) => {
    setSelectedServices(prev => prev.map(s => s._id === _id ? { ...s, quantity } : s));
  };

  const removeService = (_id: string) => {
    setSelectedServices(prev => prev.filter(s => s._id !== _id));
  };

  useEffect(() => {
    if (data) {
      const parts = data.fullName?.split(" ") || [];
      setFormData(prev => ({
        ...prev,
        firstName: parts[0] || "",
        lastName: parts.slice(1).join(" ") || "",
        phoneNumber: data.phoneNumber || "",
        insuranceType: data.insuranceType || "سایر",
        supplementaryInsurance: data.supplementaryInsurance || "سایر",
      }));
    }
  }, [data]);

  const handlePrintReceipt = async (payload: any) => {
    try {
      const res = await fetch("http://127.0.0.1:5000/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        console.error("خطا در چاپ رسید:", errData);
        toast.error("خطا در چاپ رسید ❌");
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "receipt.png";
      link.click();
      URL.revokeObjectURL(url);
      toast.success("رسید چاپ شد ✅");
    } catch (error) {
      console.error(error);
      toast.error("خطا در اتصال به سرور چاپ ❌");
    }
  };

  const handleSubmit = async () => {
    if (!formData.firstName || !formData.lastName || !formData.doctorId || selectedServices.length === 0) {
      toast.error("لطفا فیلدهای ضروری را پر کنید");
      return;
    }

    const backendPayload = {
      patientName: `${formData.firstName} ${formData.lastName}`,
      phoneNumber: formData.phoneNumber,
      relationWithGuardian: formData.relation || "خود شخص",
      visitType: "ویزیت سرپایی",
      insuranceType: formData.insuranceType,
      supplementaryInsurance: formData.supplementaryInsurance,
      doctorId: formData.doctorId,
      staffId: "650f0c1a2f3b3a0012345679",
      appointmentDate: formData.visitDate,
      appointmentTime: defaultTime,
      services: selectedServices.map(s => ({ serviceId: s._id, quantity: s.quantity })),
      nationalId,
    };

    setLoading(true);
    await onSubmit(backendPayload);

    const printPayload = {
      footer_text: "drfn.ir",
      bill_number: "123456",
      turn_number: "01",
      date: formData.visitDate,
      time: defaultTime,
      patient_name: `${formData.firstName} ${formData.lastName}`,
      national_code: nationalId,
      visit_type: "ویزیت سرپایی",
      doctor_name: allDoctors.find(d => d._id === formData.doctorId)?.fullName || "",
      doctor_specialty: "داخلی",
      reception_user: "رضا حسینی",
      services: selectedServices.map(s => ({ name: s.serviceName, price: s.price })),
      insurance_base: 40000,
      insurance_extra: 15000,
      total_payment: selectedServices.reduce((sum, s) => sum + s.price, 0) - 40000 - 15000,
    };

    await handlePrintReceipt(printPayload);
    setLoading(false);

    setFormData({
      firstName: "",
      lastName: "",
      gender: "",
      doctorId: "",
      visitDate: today,
      insuranceType: "سایر",
      supplementaryInsurance: "سایر",
      relation: "",
      phoneNumber: "",
    });
    setSelectedServices([]);
  };

  return (
    <div className="flex flex-col justify-center items-center p-4">
      {/* فرم اصلی */}
      <div className="flex justify-between w-full gap-3">
        <div className="flex flex-col w-full">
          <label className="text-right text-gray-700">نام</label>
          <Input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full py-2 px-4 mb-4 border border-gray-400 rounded text-black" />
        </div>
        <div className="flex flex-col w-full">
          <label className="text-right text-gray-700">نام خانوادگی</label>
          <Input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full py-2 px-4 mb-4 border border-gray-400 rounded text-black" />
        </div>
        <div className="flex flex-col w-full">
          <label className="text-right text-gray-700">جنسیت</label>
          <select name="gender" value={formData.gender} onChange={handleChange} className="w-full rounded-xl py-2 px-4 mb-4 border border-gray-400 text-black">
            <option value="">جنسیت</option>
            <option value="مرد">مرد</option>
            <option value="زن">زن</option>
          </select>
        </div>
      </div>

      {/* نسبت و شماره تماس */}
      <div className="flex justify-between w-full gap-3">
        <div className="flex flex-col w-full">
          <label className="text-right text-gray-700">نسبت با سرپرست</label>
          <Input type="text" name="relation" value={formData.relation} onChange={handleChange} className="w-full py-2 px-4 mb-4 border border-gray-400 rounded text-black" />
        </div>
        <div className="flex flex-col w-full">
          <label className="text-right text-gray-700">شماره تماس</label>
          <Input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="w-full py-2 px-4 mb-4 border border-gray-400 rounded text-black" />
        </div>
      </div>

      {/* تاریخ مراجعه */}
      <div className="flex flex-col w-full mb-4">
        <label className="text-right text-gray-700">تاریخ مراجعه</label>
        <Input type="date" name="visitDate" value={formData.visitDate} onChange={handleChange} className="w-full py-2 px-4 border border-gray-400 rounded text-black" />
      </div>

      {/* انتخاب پزشک */}
      <div className="flex flex-col w-full mb-4">
        <label className="text-right text-gray-700">پزشک</label>
        <select name="doctorId" value={formData.doctorId} onChange={handleChange} className="w-full py-2 px-4 border border-gray-400 rounded text-black">
          <option value="">انتخاب پزشک</option>
          {allDoctors.map(d => (
            <option key={d._id} value={d._id}>{d.fullName}</option>
          ))}
        </select>
      </div>

      {/* انتخاب خدمات */}
      <div className="flex flex-col w-full relative mb-4">
        <label className="text-right text-gray-700">خدمات</label>
        <Input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="جستجوی خدمات..." className="w-full py-2 px-4 mb-2 border border-gray-400 rounded text-black" />
        {searchQuery && (
          <ul className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded max-h-40 overflow-y-auto z-10">
            {allServices.filter(s => s.serviceName.toLowerCase().includes(searchQuery.toLowerCase())).map(s => (
              <li key={s._id} onClick={() => addService(s)} className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-black">
                {s.serviceName} - {s.price.toLocaleString()} تومان
              </li>
            ))}
          </ul>
        )}
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedServices.map(s => (
            <div key={s._id} className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
              <span>{s.serviceName} - {s.price.toLocaleString()} تومان</span>
              <input type="number" min={1} value={s.quantity} onChange={e => updateQuantity(s._id, Number(e.target.value))} className="w-12 px-1 py-0.5 border rounded text-xs text-black" />
              <button onClick={() => removeService(s._id)} className="text-red-500 font-bold px-1">×</button>
            </div>
          ))}
        </div>
      </div>

      {/* دکمه‌ها */}
      <div className="flex w-full gap-4 mt-5">
        <Button name={loading ? "در حال ارسال..." : "ثبت اطلاعات"} onClick={handleSubmit} />
        <button className="w-full bg-gray-500 text-white rounded-lg py-2">صرف نظر از پذیرش</button>
      </div>
    </div>
  );
};

export default ReseptionForm;
