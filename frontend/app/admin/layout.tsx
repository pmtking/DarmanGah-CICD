"use client";

import { useEffect, useState } from "react";
import DashboardNav from "@/components/DashboardNav/page";
import SideBar from "@/components/SideBar/page";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [authorized, setAuthorized] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<boolean[]>([false, false, false, false]);
  const router = useRouter();

  // useEffect(() => {
  //   const role = Cookies.get("role");
  //   const tickIntervals: NodeJS.Timeout[] = [];

  //   if (role === "MANAGER") {
  //     // تیک زدن آیتم‌ها یکی یکی
  //     progress.forEach((_, index) => {
  //       const interval = setTimeout(() => {
  //         setProgress((prev) => {
  //           const newState = [...prev];
  //           newState[index] = true;
  //           return newState;
  //         });
  //       }, 600 * (index + 1));
  //       tickIntervals.push(interval);
  //     });

  //     // بعد از تمام شدن تیک‌ها اجازه دسترسی بده
  //     const authTimeout = setTimeout(() => {
  //       setAuthorized(true);
  //       setLoading(false);
  //     }, 3000);
  //     tickIntervals.push(authTimeout);
  //   } else {
  //     router.push("/login");
  //     setLoading(false);
  //   }

  //   return () => tickIntervals.forEach((t) => clearTimeout(t));
  // }, [router]);

  return (
    <div className="flex min-h-screen w-full">
      <SideBar />
      <div className="flex-1 flex flex-col">
        <DashboardNav user={{ name: "محمد" }} />
        <main className="flex-1 px-5 py-4">{children}</main>

        {/* 🔹 مدال شیشه‌ای لودر */}
        {loading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-10 flex flex-col items-center gap-6 shadow-2xl">
              {/* عنوان */}
              <h1 className="text-3xl font-bold text-white mb-2">بررسی دسترسی سیستم</h1>
              <p className="text-gray-300 text-sm text-center">
                لطفاً صبر کنید، امنیت و صحت دسترسی شما بررسی می‌شود...
              </p>

              {/* لودر مرکزی */}
              <div className="relative flex flex-col items-center gap-6">
                <div className="w-20 h-20 border-4 border-blue-400 border-dashed rounded-full animate-spin shadow-lg"></div>

                {/* آیتم‌های تیک‌خور */}
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
        )}
      </div>
    </div>
  );
}
