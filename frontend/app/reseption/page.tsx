"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import api from "@/libs/axios";
import Cookies from "js-cookie";

import Button from "@/components/Button/page";
import Input from "@/components/Input/page";
import ReseptionForm from "@/components/ReseptionForm/page";
import ReseptionNav from "@/components/ReseptionNav/page";
import TitleComponents from "@/components/TitleComponents/page";
import { useUser } from "@/context/UserContext";
import useReseption from "@/hooks/useReseption";

const RespontionPage = () => {
  const { user } = useUser();


  const [nationalId, setNationalId] = useState<string>("");
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [patientData, setPatientData] = useState<any>(null);
  const [isDisebled, setIsDisebled] = useState(true)
  const { checkNationalCode } = useReseption();




  // استعلام کد ملی
  const handleVerify = async () => {
    const check = checkNationalCode(nationalId)
    check.success === true ? "ol" : toast.error('sdsds'); setIsDisebled(true);
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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setNationalId(val);
    const res = checkNationalCode(val)
    if (res.success) {
      setIsDisebled(false)
    } else {
      setIsDisebled(true)
    }

  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleVerify();

  };

  return (
    <div className="flex flex-col w-full  items-center mt-[-152px]">
      {user && <ReseptionNav patientCount={42} user={user} />}

      <main className="flex flex-col justify-start items-center w-[60%] h-[80%] px-5 py-8 rounded-2xl shadow-2xl">
        <div className="mb-8 flex">
          <TitleComponents h1="پذیرش درمانگاه" color="#fff" classname="flex" />
        </div>

        {!isVerified ? (
          <div className="w-full max-w-xl text-center text-white rounded-xl transition-all duration-300 bg-white/30 p-6">
            <Input
              type="text"
              value={nationalId}
              placeholder="کد ملی را وارد کنید"
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              className="w-full py-5 px-5 border border-gray-400 bg-white rounded text-black shadow-2xl"
            />
            <Button
              onClick={handleVerify}
              name="استعلام"
              loading={loading}
              className="mt-4 px-4 py-2 text-white rounded hover:opacity-90"
              disabled={isDisebled}
            />
          </div>
        ) : (
          <div className=" w-full text-center ">
            <ReseptionForm

            />
          </div>
        )}
      </main>
    </div>
  );
};

export default RespontionPage;
