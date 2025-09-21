"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "@/libs/axios";

import Button from "@/components/Button/page";
import Input from "@/components/Input/page";
import ReseptionForm from "@/components/ReseptionForm/page";
import ReseptionNav from "@/components/ReseptionNav/page";
import TitleComponents from "@/components/TitleComponents/page";
import { useUser } from "@/context/UserContext";

const RespontionPage = () => {
  const { user } = useUser();

  const [nationalId, setNationalId] = useState<string>("");
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [patientData, setPatientData] = useState<any>(null);

  // استعلام کد ملی
  const handleVerify = async () => {
    if (nationalId.length !== 10) {
      toast.error("کد ملی باید ۱۰ رقم باشد");
      return;
    }
    try {
      setLoading(true);
      const res = await api.post("/api/appointment/find", { nationalCode: nationalId });
      if (res.data.success) {
        setPatientData(res.data.data);
        setIsVerified(true);
        toast.success(res.data.message || "کد ملی معتبر است ✅");
      } else {
        toast.error(res.data.message || "کد ملی یافت نشد ❌");
      }
    } catch (err) {
      console.error(err);
      toast.error("خطا در استعلام نوبت ❌");
      setIsVerified(true);
    } finally {
      setLoading(false);
    }
  };

  // ارسال داده به سرور Flask برای چاپ رسید
  const printReceiptServer = async (receiptData: any) => {
    try {
      const res = await fetch("http://127.0.0.1:5000/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(receiptData),
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

  // ثبت پذیرش و چاپ
  const handleCreateReception = async (formData: any) => {
    try {
      const payload = { ...formData, nationalId };
      const res = await api.post("/api/reseption/add", payload, { responseType: "json" });

      // فرض: سرور داده‌های رسید شامل خدمات و total را برمی‌گرداند
      const receiptData = res.data;

      // ارسال داده‌ها به سرور چاپ Flask
      await printReceiptServer(receiptData);

      toast.success("پذیرش با موفقیت ثبت شد ✅");
    } catch (err) {
      console.error(err);
      toast.error("خطا در ثبت پذیرش یا چاپ قبض ❌");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleVerify();
  };
  useEffect(() => {

  },)

  return (
    <div className="flex flex-col w-full justify-center items-center">
      {user && <ReseptionNav patientCount={42} user={user} />}

      <main className="bg-white/30 flex flex-col justify-start items-center w-[60%] h-[80%] px-5 py-8 rounded-2xl border-2 border-gray-600 shadow-2xl">
        <div className="mt-8 flex">
          <TitleComponents h1="پذیرش درمانگاه" color="#fff" classname="flex" />
        </div>

        {!isVerified ? (
          <div className="w-full max-w-xl text-center text-white rounded-xl transition-all duration-300 bg-white/30 p-6">
            <Input
              type="text"
              value={nationalId}
              placeholder="کد ملی را وارد کنید"
              onChange={(e) => setNationalId(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full py-5 px-5 border border-gray-400 bg-white rounded text-black shadow-2xl"
            />
            <Button
              onClick={handleVerify}
              name="استعلام"
              loading={loading}
              className="mt-4 px-4 py-2 text-white rounded hover:opacity-90"
            />
          </div>
        ) : (
          <div className="mt-6 w-full text-center text-white rounded-xl p-4 transition-all duration-300 bg-white px-5">
            <ReseptionForm
              data={patientData}
              nationalId={nationalId}
              onSubmit={handleCreateReception}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default RespontionPage;
