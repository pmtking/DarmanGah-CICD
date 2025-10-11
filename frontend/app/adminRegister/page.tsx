'use client';
import Input from "@/components/Input/page";
import { useState } from "react";
import Button from "@/components/Button/page";
import useAuth from "@/hooks/useAuth";

const AdminRegisterPage = () => {
  const [phone, setPhone] = useState(""); // شماره تماس
  const [password, setPassword] = useState(""); // رمز عبور

  const { register, data: user, loading, error } = useAuth();

  const handleRegister = async () => {
    if (!phone || !password) {
      alert("لطفا تمام فیلدها را پر کنید.");
      return;
    }

    try {
      await register({
        number:phone,
        password,
        role: "MANAGER",
      });
      // می‌تونی بعد از ثبت‌نام موفق، کاربر رو منتقل کنی یا پیام موفقیت نشون بدی
      console.log("ثبت‌نام موفق:", user);
    } catch (err) {
      console.error("خطا در ثبت‌نام:", err);
    }
  };

  return (
    <main className="flex justify-center items-center w-full h-screen">
      <div className="flex flex-col justify-center gap-10 items-center border border-amber-50 px-10 py-10 rounded-3xl">
        <h1 className="text-2xl font-bold">ثبت‌نام مدیر</h1>

        <div className="flex flex-col justify-center items-center gap-3 w-full">
          <Input
            placeholder="شماره تماس"
            type="text"
            value={phone}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPhone(e.target.value)
            }
            className="outline-0 border rounded-2xl border-gray-500 px-3 py-2 w-64"
          />
          <Input
            placeholder="رمز عبور"
            type="password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
            className="outline-0 border rounded-2xl border-gray-500 px-3 py-2 w-64"
          />
        </div>

        <Button
          name={loading ? "در حال ثبت‌نام..." : "ثبت‌نام"}
          type="button"
          onClick={handleRegister}
          disabled={loading}
        />

        {error && (
          <p className="text-red-500 text-sm mt-2">خطا: {String(error)}</p>
        )}
      </div>
    </main>
  );
};

export default AdminRegisterPage;
