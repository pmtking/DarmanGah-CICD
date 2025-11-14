"use client";

import { UserProvider, useUser } from "@/context/UserContext";
import { Bezier, MessageText, Teacher } from "iconsax-reactjs";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface RespontionLayoutType {
  children: React.ReactNode;
}

// ---------- Navbar ----------
const Navbar = () => {
  const { user } = useUser();
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <nav className="w-full px-6 py-4 flex justify-between items-center shadow-md bg-white/20 backdrop-blur-md text-gray-900 rounded-b-lg relative">
      <div className="flex items-center gap-4">
        <span className="font-bold text-lg cursor-pointer" onClick={() => router.push("/")}>
          درمانگاه
        </span>
        {user && (
          <span className="text-sm">
            خوش آمدید، <span className="font-semibold">{user.name}</span>
          </span>
        )}
      </div>

      <div className="flex items-center gap-3 relative">
        <button
          onClick={() => router.push("/reseption/appointments")}
          className="bg-blue-600/80 hover:bg-blue-700/90 px-3 py-1.5 rounded text-white text-sm backdrop-blur-sm transition-all duration-200"
        >
          لیست نوبت‌ها
        </button>
        <button
          onClick={() => router.push("/support/ticket")}
          className="bg-green-600/80 hover:bg-green-700/90 px-3 py-1.5 rounded text-white text-sm flex items-center gap-1 transition-all duration-200"
        >
          <MessageText size={18} />
          ارسال تیکت
        </button>
        <button
          onClick={() => router.push("/reports")}
          className="bg-yellow-600/80 hover:bg-yellow-700/90 px-3 py-1.5 rounded text-white text-sm flex items-center gap-1 transition-all duration-200"
        >
          <Teacher size={18} />
          گزارش‌ها
        </button>
        <button className="bg-gray-200/30 hover:bg-gray-300/40 p-2 rounded-full transition-all duration-200">
          <Bezier size={20} />
        </button>
        {user && (
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(prev => !prev)}
              className="flex items-center gap-2 px-3 py-1.5 rounded bg-gray-100/40 hover:bg-gray-200/50 transition-all duration-200"
            >
              {user.name}
            </button>
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-50 flex flex-col">
                <button className="px-4 py-2 text-sm hover:bg-gray-100 text-gray-800 text-left" onClick={() => router.push("/profile")}>پروفایل</button>
                <button className="px-4 py-2 text-sm hover:bg-gray-100 text-gray-800 text-left" onClick={() => router.push("/settings")}>تنظیمات</button>
                <button className="px-4 py-2 text-sm hover:bg-gray-100 text-gray-800 text-left" onClick={() => { localStorage.clear(); router.push("/login"); }}>خروج</button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

// ---------- بیمه ----------
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

// ---------- Loader با تیک‌خور ----------
const LoadingScreen = () => {
  const [progress, setProgress] = useState([false, false, false]);

  useEffect(() => {
    const timers = progress.map((_, i) =>
      setTimeout(() => {
        setProgress(prev => {
          const copy = [...prev];
          copy[i] = true;
          return copy;
        });
      }, (i + 1) * 800)
    );
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-10 flex flex-col items-center gap-6 shadow-2xl">
        <h1 className="text-3xl font-bold text-white mb-2">بررسی دسترسی سیستم</h1>
        <p className="text-gray-300 text-sm text-center">
          لطفاً صبر کنید، امنیت و صحت دسترسی شما بررسی می‌شود...
        </p>

        <div className="relative flex flex-col items-center gap-6">
          <div className="w-20 h-20 border-4 border-blue-400 border-dashed rounded-full animate-spin shadow-lg"></div>

          <div className="flex gap-5">
            {progress.map((done, i) => (
              <div
                key={i}
                className={`w-8 h-8 border-2 rounded-full flex items-center justify-center transition-all duration-500
                  ${done ? "bg-green-500 border-green-500 shadow-lg animate-bounce" : "border-gray-400"}
                `}
              >
                {done && <span className="text-white font-bold text-lg">✓</span>}
              </div>
            ))}
          </div>
        </div>

        <p className="text-gray-400 text-sm mt-2">
          🔒 اتصال امن و بررسی مجوزها در جریان است
        </p>
      </div>
    </div>
  );
};

// ---------- Layout ----------
const RespontionLayout = ({ children }: RespontionLayoutType) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500); // کل فرآیند لود 2.5 ثانیه
    return () => clearTimeout(timer);
  }, []);

  return (
    <UserProvider>
      <div className="flex flex-col w-full h-screen relative">
        {loading && <LoadingScreen />}
        <Navbar />
        <main className="flex flex-1 items-start justify-center gap-6 h-screen">
          
          <div className="flex-1 rounded-xl mt-[150px] ">{children}</div>
        </main>
      </div>
    </UserProvider>
  );
};

export default RespontionLayout;
