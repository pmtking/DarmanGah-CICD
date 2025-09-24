"use client";

import React, { useState, useEffect } from "react";
import Input from "../Input/page";
import Button from "../Button/page";
import toast from "react-hot-toast";
import { jsPDF } from "jspdf";
// import vazirmatn from "@/public/Vazir.ttf"; // نیازمند نصب: npm install vazirmatn

type ServiceItem = {
  _id: string;
  serviceName: string;
  price: number;
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
  insuranceType: string;
  supplementaryInsurance: string;
  relation: string;
  phoneNumber: string;
};

type ReseptionFormProps = {
  data?: any;
  nationalId: string;
  onSubmit: (payload: any) => void;
};

const ReseptionForm = ({ data, nationalId, onSubmit }: ReseptionFormProps) => {
  const today = new Date().toISOString().split("T")[0];
  const defaultTime = new Date().toLocaleTimeString("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
  });

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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedServices, setSelectedServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(false);

  const [showConfirm, setShowConfirm] = useState(false);
  const [printPayload, setPrintPayload] = useState<any>(null);

  // دریافت خدمات و پزشکان
  useEffect(() => {
    fetch("http://192.171.1.16:4000/api/service/")
      .then((res) => res.json())
      .then((data) =>
        setAllServices(
          data.map((s: any) => ({
            _id: s._id,
            serviceName: s.serviceName,
            price: s.price || 0,
            quantity: 1,
          }))
        )
      )
      .catch(() => toast.error("خطا در دریافت خدمات"));

    fetch("http://192.171.1.16:4000/api/doctors/")
      .then((res) => res.json())
      .then((data) =>
        setAllDoctors(
          data.map((d: any) => ({ _id: d.personnelId, fullName: d.name }))
        )
      )
      .catch(() => toast.error("خطا در دریافت پزشکان"));
  }, []);

  useEffect(() => {
    if (data) {
      const parts = data.fullName?.split(" ") || [];
      setFormData((prev) => ({
        ...prev,
        firstName: parts[0] || "",
        lastName: parts.slice(1).join(" ") || "",
        phoneNumber: data.phoneNumber || "",
        insuranceType: data.insuranceType || "سایر",
        supplementaryInsurance: data.supplementaryInsurance || "سایر",
      }));
    }
  }, [data]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addService = (service: ServiceItem) => {
    if (!selectedServices.find((s) => s._id === service._id)) {
      setSelectedServices([...selectedServices, { ...service, quantity: 1 }]);
      setSearchQuery("");
    } else {
      toast.error("این خدمت قبلا انتخاب شده است");
    }
  };

  const updateQuantity = (_id: string, quantity: number) => {
    setSelectedServices((prev) =>
      prev.map((s) => (s._id === _id ? { ...s, quantity } : s))
    );
  };

  const removeService = (_id: string) => {
    setSelectedServices((prev) => prev.filter((s) => s._id !== _id));
  };

  const handleSubmit = async () => {
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.doctorId ||
      selectedServices.length === 0
    ) {
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
      services: selectedServices.map((s) => ({
        serviceId: s._id,
        quantity: s.quantity,
      })),
      nationalId,
    };

    setLoading(true);
    await onSubmit(backendPayload);

    const payload = {
      bill_number: "123456",
      turn_number: "01",
      date: formData.visitDate,
      time: defaultTime,
      patient_name: `${formData.firstName} ${formData.lastName}`,
      national_code: nationalId,
      visit_type: "ویزیت سرپایی",
      doctor_name:
        allDoctors.find((d) => d._id === formData.doctorId)?.fullName || "",
      reception_user: "رضا حسینی",
      services: selectedServices.map((s) => ({
        name: s.serviceName,
        price: s.price,
        quantity: s.quantity,
      })),
      insurance_base: 40000,
      insurance_extra: 15000,
      total_payment:
        selectedServices.reduce(
          (sum, s) => sum + (s.price || 0) * (s.quantity || 1),
          0
        ) - 40000 - 15000,
    };

    setPrintPayload(payload);
    setShowConfirm(true);
    setLoading(false);
  };

  const handlePrintPDF = async (payload: any) => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });

    // بارگذاری فونت Vazirmatn
    const fontBuffer = await fetch('../../public/Vazir.ttf').then((res) => res.arrayBuffer());
    const base64Font = btoa(
      new Uint8Array(fontBuffer).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ""
      )
    );
    doc.addFileToVFS("Vazirmatn.ttf", base64Font);
    doc.addFont("Vazirmatn.ttf", "Vazirmatn", "normal");
    doc.setFont("Vazirmatn");

    let y = 50;
    doc.setFontSize(16);
    doc.text("قبض پذیرش بیمار", 550, y, { align: "right" });
    y += 30;

    doc.setFontSize(12);
    doc.text(`نام بیمار: ${payload.patient_name}`, 550, y, { align: "right" });
    y += 20;
    doc.text(`کد ملی: ${payload.national_code}`, 550, y, { align: "right" });
    y += 20;
    doc.text(`پزشک: ${payload.doctor_name}`, 550, y, { align: "right" });
    y += 20;
    doc.text(`تاریخ: ${payload.date} - ساعت: ${payload.time}`, 550, y, {
      align: "right",
    });
    y += 30;

    // جدول خدمات
    payload.services.forEach((s: any) => {
      doc.text(
        `${s.name} | تعداد: ${s.quantity} | قیمت: ${s.price.toLocaleString()} | جمع: ${(s.price * s.quantity).toLocaleString()}`,
        550,
        y,
        { align: "right" }
      );
      y += 20;
    });

    y += 20;
    doc.setFontSize(14);
    doc.text(
      `جمع کل پرداختی: ${payload.total_payment.toLocaleString()} تومان`,
      550,
      y,
      { align: "right" }
    );

    doc.output("dataurlnewwindow");
  };

  const confirmAndPrint = () => {
    if (printPayload) handlePrintPDF(printPayload);
    setShowConfirm(false);
    setPrintPayload(null);
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
      <div className="flex flex-col w-full gap-3">
        {/* نام و نام خانوادگی و جنسیت */}
        <div className="flex justify-between gap-3 w-full">
          <Input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full py-2 px-4 mb-4 border rounded text-black"
            placeholder="نام"
          />
          <Input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full py-2 px-4 mb-4 border rounded text-black"
            placeholder="نام خانوادگی"
          />
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full py-2 px-4 mb-4 border rounded text-black"
          >
            <option value="">جنسیت</option>
            <option value="مرد">مرد</option>
            <option value="زن">زن</option>
          </select>
        </div>

        {/* نسبت و شماره تماس */}
        <div className="flex justify-between gap-3 w-full">
          <Input
            type="text"
            name="relation"
            value={formData.relation}
            onChange={handleChange}
            className="w-full py-2 px-4 mb-4 border rounded text-black"
            placeholder="نسبت با سرپرست"
          />
          <Input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="w-full py-2 px-4 mb-4 border rounded text-black"
            placeholder="شماره تماس"
          />
        </div>

        {/* تاریخ و پزشک */}
        <Input
          type="date"
          name="visitDate"
          value={formData.visitDate}
          onChange={handleChange}
          className="w-full py-2 px-4 mb-4 border rounded text-black"
        />

        <select
          name="doctorId"
          value={formData.doctorId}
          onChange={handleChange}
          className="w-full py-2 px-4 mb-4 border rounded text-black"
        >
          <option value="">انتخاب پزشک</option>
          {allDoctors.map((d) => (
            <option key={d._id} value={d._id}>
              {d.fullName}
            </option>
          ))}
        </select>

        {/* خدمات */}
        <div className="flex flex-col w-full relative mb-4">
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجوی خدمات..."
            className="w-full py-2 px-4 mb-2 border rounded text-black"
          />
          {searchQuery && (
            <ul className="absolute top-full left-0 right-0 bg-white border rounded max-h-40 overflow-y-auto z-10">
              {allServices
                .filter((s) =>
                  s.serviceName
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
                )
                .map((s) => (
                  <li
                    key={s._id}
                    onClick={() => addService(s)}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-black"
                  >
                    {s.serviceName} - {s.price.toLocaleString()} تومان
                  </li>
                ))}
            </ul>
          )}
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedServices.map((s) => (
              <div
                key={s._id}
                className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
              >
                <span>
                  {s.serviceName} - {s.price.toLocaleString()} تومان
                </span>
                <input
                  type="number"
                  min={1}
                  value={s.quantity}
                  onChange={(e) =>
                    updateQuantity(s._id, Number(e.target.value))
                  }
                  className="w-12 px-1 py-0.5 border rounded text-xs text-black"
                />
                <button
                  onClick={() => removeService(s._id)}
                  className="text-red-500 font-bold px-1"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex w-full gap-4 mt-5">
          <Button
            name={loading ? "در حال ارسال..." : "ثبت اطلاعات"}
            onClick={handleSubmit}
          />
          <button className="w-full bg-gray-500 text-white rounded-lg py-2">
            صرف نظر
          </button>
        </div>
      </div>

      {/* مدال تایید */}
      {showConfirm && printPayload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-[500px] p-6 text-black">
            <h2 className="text-xl font-bold mb-4 text-right">
              آیا می‌خواهید قبض چاپ شود؟
            </h2>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
              >
                لغو
              </button>
              <button
                onClick={confirmAndPrint}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              >
                تایید و چاپ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReseptionForm;
