"use client";

import { UserProvider, useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";

interface RespontionLayoutType {
  children: React.ReactNode;
}

const Navbar = () => {
  const { user } = useUser();
  const router = useRouter();

  return (
    <nav className="w-full px-6 py-4 flex justify-between items-center shadow-md bg-white/20 backdrop-blur-md text-white rounded-b-lg">
      <div className="flex items-center gap-4">
        <span className="font-bold text-lg">درمانگاه</span>
        {user && (
          <span className="text-sm">
            خوش آمدید، <span className="font-semibold">{user.name}</span>
          </span>
        )}
      </div>
      <div>
        <button
          onClick={() => router.push("/reseption/appointments")}
          className="bg-blue-600/80 hover:bg-blue-700/90 px-3 py-1.5 rounded text-white text-sm backdrop-blur-sm"
        >
          لیست نوبت‌ها
        </button>
      </div>
    </nav>
  );
};

const basicInsurance = [
  { name: "بیمه سلامت", url: "https://www.salamat.gov.ir" },
  { name: "بیمه تامین اجتماعی", url: "https://www.tamin.ir" },
  { name: "بیمه نیروهای مسلح", url: "https://www.alborzins.ir" },
];

const supplementaryInsurance = [
  { name: "بیمه دانا", url: "https://www.dana-insurance.com" },
  { name: "بیمه دی", url: "https://bimeday.ir" },
  { name: "بیمه آتیه سازان حافظ", url: "https://atiyehsazan.ir" },
  { name: "بیمه معلم", url: "https://mic.co.ir" },
  { name: "بیمه ملت", url: "https://melat.ir" },
  { name: "بیمه سینا", url: "https://sinainsurance.com" },
  { name: "بیمه میهن", url: "https://mihaninsurance.com" },
];

const InsuranceGrid = ({ insurances }: { insurances: typeof basicInsurance }) => (
  <div className="grid grid-cols-2 gap-2">
    {insurances.map((ins) => (
      <div
        key={ins.name}
        className="bg-white/20 backdrop-blur-md shadow-sm rounded p-2 flex flex-col items-center gap-1 text-center"
      >
        <h3 className="font-semibold text-white text-xs">{ins.name}</h3>
        <button
          onClick={() => window.open(ins.url, "_blank")}
          className="bg-blue-600/80 hover:bg-blue-700/90 px-2 py-1 rounded text-white text-[10px] w-full"
        >
          استعلام
        </button>
      </div>
    ))}
  </div>
);

const RespontionLayout = ({ children }: RespontionLayoutType) => {
  return (
    <UserProvider>
      <div className="flex flex-col w-full h-screen">
        <Navbar />
        <main className="flex flex-1 items-start justify-center gap-6 p-6">
          {/* کارت‌های بیمه */}
          <div className="flex flex-col gap-4 w-64">
            <h2 className="text-base font-bold text-white mb-1">بیمه‌های پایه</h2>
            <InsuranceGrid insurances={basicInsurance} />

            <h2 className="text-base font-bold text-white mt-4 mb-1">
              بیمه‌های تکمیلی
            </h2>
            <InsuranceGrid insurances={supplementaryInsurance} />
          </div>

          {/* بخش پذیرش */}
          <div className="flex-1 rounded-xl p-6 shadow-lg">{children}</div>
        </main>
      </div>
    </UserProvider>
  );
};

export default RespontionLayout;
