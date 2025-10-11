"use client";

import React, { useState, useEffect } from "react";
import Input from "../Input/page";
import Button from "../Button/page";
import toast from "react-hot-toast";
import api from "@/libs/axios";
import Cookies from "js-cookie";

type ServiceItem = {
  _id: string;
  serviceName: string;
  pricePublic: number;
  baseInsurances: { companyName: string; contractPrice: number }[];
  supplementaryInsurances: { companyName: string; contractPrice: number }[];
  quantity: number;
};

type DoctorItem = {
  _id: string;
  fullName: string;
};

type FormData = {
  firstName: string;
  lastName: string;
  gender: string;
  doctorId: string;
  visitDate: string;
  visitType: string;
  insuranceType: string;
  supplementaryInsurance: string;
  relation: string;
  phoneNumber: string;
  receptionUser: string;
};

type ReseptionFormProps = {
  data?: any;
  nationalId: string;
};

const ReseptionForm = ({ data, nationalId }: ReseptionFormProps) => {
  const today = new Date().toISOString().split("T")[0];
  const defaultTime = new Date().toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" });

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    gender: "",
    doctorId: "",
    visitDate: today,
    visitType: "اولیه",
    insuranceType: "سایر",
    supplementaryInsurance: "سایر",
    relation: "خود شخص",
    phoneNumber: "",
    receptionUser: "",
  });

  const [allServices, setAllServices] = useState<ServiceItem[]>([]);
  const [allDoctors, setAllDoctors] = useState<DoctorItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchDoctor, setSearchDoctor] = useState("");
  const [selectedServices, setSelectedServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch services & doctors
  useEffect(() => {
    api.get("api/service")
      .then(res => setAllServices(res.data.map((s: any) => ({
        _id: s._id,
        serviceName: s.serviceName,
        pricePublic: s.pricePublic,
        baseInsurances: s.baseInsurances || [],
        supplementaryInsurances: s.supplementaryInsurances || [],
        quantity: 1,
      }))))
      .catch(() => toast.error("خطا در دریافت خدمات"));

    api.get("api/doctors")
      .then(res => setAllDoctors(res.data.map((d: any) => ({
        _id: d.personnelId,
        fullName: d.name,
      }))))
      .catch(() => toast.error("خطا در دریافت پزشکان"));
  }, []);

  // Load reception user from cookie
  useEffect(() => {
    const cookieUser = Cookies.get("user");
    if (cookieUser) {
      try {
        const user = JSON.parse(cookieUser);
        setFormData(prev => ({ ...prev, receptionUser: user.name }));
      } catch { }
    }
  }, []);

  // Prefill patient data if available
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getServicePriceDetails = (service: ServiceItem) => {
    const base = service.baseInsurances.find(b => b.companyName.includes(formData.insuranceType))?.contractPrice || 0;
    const extra = service.supplementaryInsurances.find(s => s.companyName.includes(formData.supplementaryInsurance))?.contractPrice || 0;
    const patientPay = service.pricePublic - base - extra;
    return { originalPrice: service.pricePublic, basePrice: base, supplementaryPrice: extra, patientPay };
  };

  const addService = (service: ServiceItem) => {
    if (!selectedServices.find(s => s._id === service._id)) {
      setSelectedServices([...selectedServices, { ...service, quantity: 1 }]);
      setSearchQuery("");
    } else toast.error("این خدمت قبلا انتخاب شده است");
  };

  const updateQuantity = (_id: string, quantity: number) =>
    setSelectedServices(prev => prev.map(s => s._id === _id ? { ...s, quantity } : s));

  const removeService = (_id: string) =>
    setSelectedServices(prev => prev.filter(s => s._id !== _id));

  const calculateTotal = () => selectedServices.reduce((sum, s) => {
    const { patientPay } = getServicePriceDetails(s);
    return sum + patientPay * s.quantity;
  }, 0);

  const handleSubmit = async () => {
    if (!formData.firstName || !formData.lastName || !formData.doctorId || selectedServices.length === 0) {
      toast.error("لطفا فیلدهای ضروری را پر کنید");
      return;
    }

    const payload = {
      patientName: `${formData.firstName} ${formData.lastName}`,
      phoneNumber: formData.phoneNumber,
      relationWithGuardian: formData.relation || "خود شخص",
      visitType: formData.visitType,
      insuranceType: formData.insuranceType,
      supplementaryInsurance: formData.supplementaryInsurance,
      doctorId: formData.doctorId,
      staffId: "650f0c1a2f3b3a0012345679",
      appointmentDate: formData.visitDate,
      appointmentTime: defaultTime,
      services: selectedServices.map(s => {
        const { originalPrice, basePrice, supplementaryPrice } = getServicePriceDetails(s);
        return { serviceId: s._id, quantity: s.quantity, price: originalPrice, basePrice, supplementaryPrice };
      }),
      nationalId
    };

    try {
      setLoading(true);
      await api.post("/api/reseption/add", payload);
      toast.success("اطلاعات با موفقیت ثبت شد ✅");

      setFormData(prev => ({
        firstName: "",
        lastName: "",
        gender: "",
        doctorId: "",
        visitDate: today,
        visitType: "اولیه",
        insuranceType: "سایر",
        supplementaryInsurance: "سایر",
        relation: "خود شخص",
        phoneNumber: "",
        receptionUser: prev.receptionUser
      }));
      setSelectedServices([]);
    } catch {
      toast.error("خطا در ثبت اطلاعات");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center p-4">
      <div className="flex flex-col w-full gap-3 max-w-4xl">
        {/* نام و نام خانوادگی و جنسیت */}
        <div className="flex flex-col md:flex-row gap-3 w-full">
          <Input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="نام" className="flex-1 py-2 px-4 border rounded text-black" />
          <Input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="نام خانوادگی" className="flex-1 py-2 px-4 border rounded text-black" />
          <select name="gender" value={formData.gender} onChange={handleChange} className="flex-1 py-2 px-4 border rounded text-black">
            <option value="">جنسیت</option>
            <option value="مرد">مرد</option>
            <option value="زن">زن</option>
          </select>
        </div>

        {/* نسبت با سرپرست و شماره تماس */}
        <div className="flex flex-col md:flex-row gap-3 w-full">
          <select name="relation" value={formData.relation} onChange={handleChange} className="flex-1 py-2 px-4 border rounded text-black">
            <option value="خود شخص">خود شخص</option>
            <option value="خانواده">خانواده</option>
          </select>
          <Input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="شماره تماس" className="flex-1 py-2 px-4 border rounded text-black" />
        </div>

        {/* نوع ویزیت */}
        <select name="visitType" value={formData.visitType} onChange={handleChange} className="w-full py-2 px-4 border rounded text-black">
          <option value="اولیه">اولیه</option>
          <option value="پیگیری">پیگیری</option>
          <option value="اورژانسی">اورژانسی</option>
        </select>

        {/* بیمه پایه و تکمیلی */}
        <div className="flex flex-col md:flex-row gap-3 w-full">
          <select name="insuranceType" value={formData.insuranceType} onChange={handleChange} className="flex-1 py-2 px-4 border rounded text-black">
            <option value="سایر">انتخاب بیمه پایه</option>
            <option value="تامین اجتماعی">تامین اجتماعی</option>
            <option value="سلامت">سلامت</option>
            <option value="آزاد">آزاد</option>
            <option value="نیروهای مسلح">نیروهای مسلح</option>
          </select>
          <select name="supplementaryInsurance" value={formData.supplementaryInsurance} onChange={handleChange} className="flex-1 py-2 px-4 border rounded text-black">
            <option value="سایر">انتخاب بیمه تکمیلی</option>
            <option value="دی">دی</option>
            <option value="ملت">ملت</option>
            <option value="آتیه سازان">آتیه سازان</option>
            <option value="دانا">دانا</option>
            <option value="آزاد">آزاد</option>
          </select>
        </div>

        {/* تاریخ */}
        <Input type="date" name="visitDate" value={formData.visitDate} onChange={handleChange} className="w-full py-2 px-4 border rounded text-black" />

        {/* انتخاب پزشک */}
        <div className="relative w-full mb-4">
          <Input type="text" value={searchDoctor} onChange={(e) => setSearchDoctor(e.target.value)} placeholder="جستجوی پزشک..." className="w-full py-2 px-4 border rounded text-black" />
          {searchDoctor && (
            <ul className="absolute top-full left-0 right-0 bg-white border rounded max-h-40 overflow-y-auto z-10">
              {allDoctors.filter(d => d.fullName.toLowerCase().includes(searchDoctor.toLowerCase())).map(d => (
                <li key={d._id} onClick={() => { setFormData(prev => ({ ...prev, doctorId: d._id })); setSearchDoctor(d.fullName); }} className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-black">{d.fullName}</li>
              ))}
            </ul>
          )}
        </div>

        {/* خدمات */}
        <div className="flex flex-col w-full relative mb-4">
          <Input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="جستجوی خدمات..." className="w-full py-2 px-4 mb-2 border rounded text-black" />
          {searchQuery && (
            <ul className="absolute top-full left-0 right-0 bg-white border rounded max-h-40 overflow-y-auto z-10">
              {allServices.filter(s => s.serviceName.toLowerCase().includes(searchQuery.toLowerCase())).map(s => (
                <li key={s._id} onClick={() => addService(s)} className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-black">{s.serviceName}</li>
              ))}
            </ul>
          )}

          {/* خدمات انتخابی */}
          <div className="flex flex-col gap-2 mt-2">
            {selectedServices.map(s => {
              const { patientPay } = getServicePriceDetails(s);
              const totalPrice = patientPay * s.quantity;
              return (
                <div key={s._id} className="flex items-center justify-between bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                  <div className="flex items-center gap-2">
                    <span>{s.serviceName}</span>
                    <input type="number" min={1} value={s.quantity} onChange={(e) => updateQuantity(s._id, Number(e.target.value))} className="w-12 px-1 py-0.5 border rounded text-xs text-black" />
                    <button onClick={() => removeService(s._id)} className="text-red-500 font-bold px-1">×</button>
                  </div>
                  <span className="text-sm">جمع: {totalPrice.toLocaleString()} تومان</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* جمع کل */}
        {selectedServices.length > 0 && (
          <div className="flex justify-end text-lg font-bold mt-2">
            جمع کل: {calculateTotal().toLocaleString()} تومان
          </div>
        )}

        {/* دکمه‌ها */}
        <div className="flex flex-col md:flex-row w-full gap-4 mt-5">
          <Button name={loading ? "در حال ارسال..." : "ثبت اطلاعات"} onClick={handleSubmit} />
          <button className="flex-1 bg-gray-500 text-white rounded-lg py-2" onClick={() => {
            setFormData(prev => ({
              firstName: "",
              lastName: "",
              gender: "",
              doctorId: "",
              visitDate: today,
              visitType: "اولیه",
              insuranceType: "سایر",
              supplementaryInsurance: "سایر",
              relation: "خود شخص",
              phoneNumber: "",
              receptionUser: prev.receptionUser
            }));
            setSelectedServices([]);
            setSearchDoctor("");
            setSearchQuery("");
          }}>صرف نظر</button>
        </div>
      </div>
    </div>
  );
};

export default ReseptionForm;
