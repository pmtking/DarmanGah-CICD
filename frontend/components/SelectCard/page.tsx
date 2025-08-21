import React, { useState } from "react";

const SelectCard = () => {
  const [step, setStep] = useState(1);
  const [selectedTime, setSelectedTime] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    nationalCode: "",
    phone: "",
    insuranceType: "",
  });

  const times = [
    "امروز ۳ تیر ساعت ۱۰:۳۰",
    "امروز ۳ تیر ساعت ۱۰:۴۰",
    "امروز ۳ تیر ساعت ۱۰:۴۵",
  ];

  const insuranceOptions = [
    "سلامت",
    "تأمین اجتماعی",
    "نیروهای مسلح",
    "فاقد بیمه",
  ];

  const handleSelectTime = (time:any) => {
    setSelectedTime(time);
    // setStep(2);
  };

  const handleChange = (e:any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e:any) => {
    e.preventDefault();
    console.log("📦 ارسال نهایی:", { ...formData, selectedTime });
    alert("رزرو با موفقیت انجام شد ✅");
  };

  return (
    <div className=" w-full mx-auto p-4">
      {step === 1 && (
        <div className="flex flex-col gap-3">
          {times.map((time, idx) => (
            <label
              key={idx}
              onClick={() => handleSelectTime(time)}
              className={`flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-medium cursor-pointer transition-all ${
                selectedTime === time
                  ? "bg-white text-[#00245a] border-[#00245a] shadow-md"
                  : "bg-transparent text-[#00245a] border-[#444444] opacity-70"
              }`}
            >
              {time}
              <span
                className={`w-5 h-5 flex items-center justify-center border-2 rounded-full ${
                  selectedTime === time
                    ? "border-[#00245a] bg-[#00245a]"
                    : "border-[#444444]"
                }`}
              >
                {selectedTime === time && (
                  <span className="w-2 h-2 bg-white rounded-full" />
                )}
              </span>
            </label>
          ))}

          <button
            disabled={!selectedTime}
            onClick={() => setStep(2)}
            className={`mt-4 bg-[#00245a] text-white rounded-xl py-3 px-4 text-sm font-medium transition-all ${
              !selectedTime ? "opacity-50 cursor-not-allowed" : "hover:bg-[#001a40]"
            }`}
          >
            تکمیل رزرو نوبت برای {selectedTime}
          </button>
        </div>
      )}

      {step === 2 && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
          <input
            name="name"
            type="text"
            placeholder="مثال: کوروش هخامنشی"
            value={formData.name}
            onChange={handleChange}
            className="p-3 rounded-xl border border-gray-300"
            required
          />
          <input
            name="nationalCode"
            type="text"
            placeholder="مثال: ۱۰۵۵۵۵۶۵۶۵"
            value={formData.nationalCode}
            onChange={handleChange}
            className="p-3 rounded-xl border border-gray-300"
            required
          />
          <input
            name="phone"
            type="text"
            placeholder="مثال: ۰۹۳۶۷۸۹۸۰۵۰"
            value={formData.phone}
            onChange={handleChange}
            className="p-3 rounded-xl border border-gray-300"
            required
          />
          <select
            name="insuranceType"
            value={formData.insuranceType}
            onChange={handleChange}
            className="px-3 py-3 rounded-xl border border-gray-300"
            required
          >
            <option value="">نوع بیمه</option>
            {insuranceOptions.map((option) => (
              <option className="" key={option}>{option}</option>
            ))}
          </select>

          <button
            type="submit"
            className="mt-2 bg-[#00245a] text-white rounded-xl py-3 px-4 text-sm font-medium hover:bg-[#001a40] transition-all"
          >
            ثبت نهایی رزرو برای {selectedTime}
          </button>
        </form>
      )}
    </div>
  );
};

export default SelectCard;
