"use client";

import Button from "@/components/Button/page";
import Input from "@/components/Input/page";
import ReseptionForm from "@/components/ReseptionForm/page";
import ReseptionNav from "@/components/ReseptionNav/page";
import TitleComponents from "@/components/TitleComponents/page";
import { useUser } from "@/context/UserContext";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

// داده‌های نمونه برای اعتبارسنجی
const mockNationalCodes = ["1234567890", "9876543210"];

const RespontionPage = () => {
  const [nationalCode, setNationalCode] = useState<string>("");
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useUser();

  const handleVerify = async () => {
    if (nationalCode.length !== 10) {
      toast.error("کد ملی باید 10 رقم باشد ");
      return;
    }

    setLoading(true);

    // شبیه‌سازی فراخوانی API با یک تأخیر کوتاه
    // این کار UX بهتری ایجاد می‌کند و حس لود شدن را به کاربر منتقل می‌کند
    await new Promise((resolve) => setTimeout(resolve, 500));

    // بررسی کد ملی وارد شده در برابر داده‌های نمونه
    const exists = true;

    if (exists) {
      setIsVerified(true);
      toast.success("کد ملی معتبر است");
    } else {
      toast.error("کد ملی یافت نشد.");
    }

    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleVerify();
    }
  };
  useEffect(() => {
    const cookies = document.cookie;
    const hasToken = cookies.includes("token");
    // console.log("------------->>", user);
    if (!hasToken) {
      window.location.href = "/login";
    }
  }, []);

  return (
    <div className=" flex flex-col w-full justify-center items-center  ">
      {user && <ReseptionNav patientCount={42} user={user} />}

      <main className="  bg-white/30  flex flex-col justify-start items-center w-[60%] h-[80%] px-5 py-8 rounded-2xl border-2 border-gray-600 shadow-2xl">
        <div className="mt-8 flex ">
          <TitleComponents
            h1={"پذیرش درمانگاه "}
            color="#fff"
            classname="flex"
          />
        </div>
        {!isVerified ? (
          <div className="w-full max-w-xl text-center text-white rounded-xl transition-all duration-300 bg-white/30 p-6">
            <Input
              type="text"
              value={nationalCode}
              placeholder="کد ملی را وارد کنید"
              onChange={(e) => setNationalCode(e.target.value)}
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
            <ReseptionForm />
          </div>
        )}
      </main>
    </div>
  );
};

export default RespontionPage;
