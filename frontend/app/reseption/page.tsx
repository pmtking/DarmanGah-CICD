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

const RespontionPage = () => {
  const { user } = useUser();
  const router = useRouter();

  const [nationalId, setNationalId] = useState<string>("");
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [patientData, setPatientData] = useState<any>(null);

  // ✅ بررسی توکن و ست کردن axios
  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      toast.error("لطفاً ابتدا وارد شوید");
      router.push("/login");
    } else {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    // ✅ بررسی وجود داده در localStorage
    const storedPatient = localStorage.getItem("receptionPatient");
    if (storedPatient) {
      const patient = JSON.parse(storedPatient);
      setPatientData(patient);
      setNationalId(patient.nationalId || "");
      setIsVerified(true);
      localStorage.removeItem("receptionPatient"); // پاک کردن بعد از استفاده
    }
  }, [router]);

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleVerify();
  };

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
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default RespontionPage;
