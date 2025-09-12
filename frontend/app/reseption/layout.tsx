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
          className="bg-blue-600/80 hover:bg-blue-700/90 px-4 py-2 rounded text-white text-sm backdrop-blur-sm"
        >
          لیست نوبت‌ها
        </button>
      </div>
    </nav>
  );
};

// نمونه داده بیمه‌ها
const insuranceProviders = [
  { name: "بیمه ایران", url: "https://www.iraninsurance.ir" },
  { name: "بیمه آسیا", url: "https://www.asiainsurance.ir" },
  { name: "بیمه البرز", url: "https://www.alborzins.ir" },
];

const RespontionLayout = ({ children }: RespontionLayoutType) => {
  return (
    <UserProvider>
      <div className="flex flex-col w-full h-screen">
        <Navbar />
        <main className="flex flex-1 items-center justify-center gap-[20px] p-6">
          {/* کارت‌های بیمه */}
          <div className="flex flex-col gap-[20px] w-40">
            {insuranceProviders.map((ins) => (
              <div
                key={ins.name}
                className="bg-white/20 backdrop-blur-md shadow-md rounded-xl p-4 flex flex-col items-center gap-3"
              >
                <h3 className="font-semibold text-white">{ins.name}</h3>
                <button
                  onClick={() => window.open(ins.url, "_blank")}
                  className="bg-blue-600/80 hover:bg-blue-700/90 px-4 py-2 rounded text-white w-full"
                >
                  استعلام
                </button>
              </div>
            ))}
          </div>

          {/* بخش پذیرش */}
          <div className="flex-1 rounded-xl p-6 shadow-lg ">
            {children}
          </div>
        </main>
      </div>
    </UserProvider>
  );
};

export default RespontionLayout;
