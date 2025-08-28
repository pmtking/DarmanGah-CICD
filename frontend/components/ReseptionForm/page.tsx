import React, { useState, useEffect } from "react";
import "./style.scss";
import Input from "../Input/page";
import Button from "../Button/page";

// داده‌های تستی برای شبیه‌سازی لیست خدمات پزشکان
const doctorsServices = {
  "دکتر احمدی": ["معاینه عمومی", "نوار قلب", "تزریقات"],
  "دکتر رضایی": ["جراحی سرپایی", "بخیه", "پانسمان"],
  "دکتر محمدی": ["ارتوپدی", "شکسته‌بندی", "فیزوتراپی"],
};

const ReseptionForm = () => {
  // مدیریت وضعیت (state) برای فیلدهای مختلف فرم
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    doctorName: "",
    visitDate: "",
    insuranceType: "",
    supplementaryInsurance: "",
    relation: "",
    service: "",
  });

  // مدیریت لیست خدمات موجود برای پزشک انتخاب‌شده
  const [availableServices, setAvailableServices] = useState([]);

  // این تابع به محض تغییر نام پزشک، لیست خدمات موجود را به‌روزرسانی می‌کند.
  useEffect(() => {
    if (formData.doctorName && doctorsServices[formData.doctorName]) {
      setAvailableServices(doctorsServices[formData.doctorName]);
    } else {
      setAvailableServices([]);
    }
  }, [formData.doctorName]);

  // تابع سراسری برای به‌روزرسانی state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center p-4 ">
        {/* فیلدهای نام، نام خانوادگی و جنسیت */}
        <div className="flex justify-between w-full gap-3 ">
          <div className="flex flex-col w-full">
            <label htmlFor="firstName" className="text-right text-gray-700">
              نام
            </label>
            <Input
              id="firstName"
              type="text"
              name="firstName"
              placeholder="نام"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full py-2 px-4 mb-4 border border-gray-400 rounded text-black"
            />
          </div>
          <div className="flex flex-col w-full">
            <label htmlFor="lastName" className="text-right text-gray-700">
              نام خانوادگی
            </label>
            <Input
              id="lastName"
              type="text"
              name="lastName"
              placeholder="نام خانوادگی"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full py-2 px-4 mb-4 border border-gray-400 rounded text-black"
            />
          </div>
          <div className="flex flex-col w-full">
            <label htmlFor="gender" className="text-right text-gray-700">
              جنسیت
            </label>
            <select
              id="gender"
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

        {/* فیلد نسبت با سرپرست */}
        <div className="flex justify-between w-full gap-3">
          <div className="flex flex-col w-full">
            <label htmlFor="relation" className="text-right text-gray-700">
              نسبت با سرپرست
            </label>
            <Input
              id="relation"
              type="text"
              name="relation"
              placeholder="نسبت با سرپرست"
              value={formData.relation}
              onChange={handleChange}
              className="w-full py-2 px-4 mb-4 border border-gray-400 rounded text-black"
            />
          </div>
          <div className="flex flex-col w-full">
            <label htmlFor="lastName" className="text-right text-gray-700">
              شماره تماس
            </label>
            <Input
              id="lastName"
              type="text"
              name="lastName"
              placeholder="نام خانوادگی"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full py-2 px-4 mb-4 border border-gray-400 rounded text-black"
            />
          </div>
          <div className="flex flex-col w-full">
            <label htmlFor="lastName" className="text-right text-gray-700">
               نوع مراجعه
            </label>
            <Input
              id="lastName"
              type="text"
              name="lastName"
              placeholder="نوع مراجعه مثلا ازاد "
              value={formData.lastName}
              onChange={handleChange}
              className="w-full py-2 px-4 mb-4 border border-gray-400 rounded text-black"
            />
          </div>
        </div>

        {/* فیلد انتخاب پزشک */}
        <div className="flex justify-between items-center w-full gap-3">
          <div className="flex flex-col w-full">
            <label htmlFor="doctorName" className="text-right text-gray-700">
              نام پزشک
            </label>
            <select
              id="doctorName"
              name="doctorName"
              value={formData.doctorName}
              onChange={handleChange}
              className="w-full py-2 px-4 mb-4 border border-gray-400 rounded text-black"
            >
              <option value="">نام پزشک را انتخاب کنید</option>
              {Object.keys(doctorsServices).map((doctor, index) => (
                <option key={index} value={doctor}>
                  {doctor}
                </option>
              ))}
            </select>
          </div>

          {/* فیلد خدمات (بر اساس پزشک انتخابی نمایش داده می‌شود) */}
          {availableServices.length > 0 && (
            <div className="flex flex-col w-full">
              <label htmlFor="service" className="text-right text-gray-700">
                خدمات
              </label>
              <select
                id="service"
                name="service"
                value={formData.service}
                onChange={handleChange}
                className="w-full py-2 px-4 mb-4 border border-gray-400 rounded text-black"
              >
                <option value="">خدمات مورد نظر را انتخاب کنید</option>
                {availableServices.map((service, index) => (
                  <option key={index} value={service}>
                    {service}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* فیلد تاریخ مراجعه */}
       <div className="flex justify-between w-full gap-3">
         <div className="flex flex-col w-full">
          <label htmlFor="visitDate" className="text-right text-gray-700">
             تاریخ نوبت 
          </label>
          <Input
            id="visitDate"
            type="date"
            name="visitDate"
            value={formData.visitDate}
            onChange={handleChange}
            className="w-full py-2 px-4 mb-4 border border-gray-400 rounded text-black"
          />
        </div>
         <div className="flex flex-col w-full">
          <label htmlFor="visitDate" className="text-right text-gray-700">
            تاریخ مراجعه
          </label>
          <Input
            id="visitDate"
            type="date"
            name="visitDate"
            value={formData.visitDate}
            onChange={handleChange}
            className="w-full py-2 px-4 mb-4 border border-gray-400 rounded text-black"
          />
        </div>
       </div>

        {/* فیلد نوع بیمه اصلی */}
        <div className="flex flex-col w-full">
          <label htmlFor="insuranceType" className="text-right text-gray-700">
            نوع بیمه اصلی
          </label>
          <select
            id="insuranceType"
            name="insuranceType"
            value={formData.insuranceType}
            onChange={handleChange}
            className="w-full py-2 px-4 mb-4 border border-gray-400 rounded text-black"
          >
            <option value="">نوع بیمه اصلی</option>
            <option value="تامین اجتماعی">تامین اجتماعی</option>
            <option value="خدمات درمانی">خدمات درمانی</option>
            <option value="نیروهای مسلح">نیروهای مسلح</option>
            <option value="آزاد">آزاد</option>
          </select>
        </div>

        {/* فیلد نوع بیمه تکمیلی */}
        <div className="flex flex-col w-full">
          <label
            htmlFor="supplementaryInsurance"
            className="text-right text-gray-700"
          >
            نوع بیمه تکمیلی
          </label>
          <select
            id="supplementaryInsurance"
            name="supplementaryInsurance"
            value={formData.supplementaryInsurance}
            onChange={handleChange}
            className="w-full py-2 px-4 mb-4 border border-gray-400 rounded text-black"
          >
            <option value="">نوع بیمه تکمیلی</option>
            <option value="بیمه دانا">بیمه دانا</option>
            <option value="بیمه البرز">بیمه البرز</option>
            <option value="بیمه سینا">بیمه سینا</option>
            <option value="سایر">سایر</option>
          </select>
        </div>
        <div className="flex w-full gap-20 px-0 mt-5 ">
          <Button name="ثبت اطلاعات (F5)" />
          <button className="text-white w-full bg-gray-500 rounded-lg ">
            صرف نظر از پذیرش
          </button>
        </div>
      </div>
    </>
  );
};

export default ReseptionForm;
