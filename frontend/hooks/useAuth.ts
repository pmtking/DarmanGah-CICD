"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/libs/axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { useUser } from "@/context/UserContext";

// =======================
// 🔹 Type Definitions
// =======================
export interface User {
  id: string;
  username: string;
  name: string;
  role: "MANAGER" | "USER" | "RECEPTION";
}

interface Credentials {
  userName: string;
  password: string;
}

interface RegisterData {
  name?: string;
  number: string;
  password: string;
  role: "MANAGER" | "USER" | "RECEPTION";
}

// =======================
// 🔹 useAuth Hook
// =======================
const useAuth = () => {
  const { setUser } = useUser();
  const [data, setData] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // 🔸 Load user from cookies on mount
  useEffect(() => {
    const cookieUser = Cookies.get("user");
    const token = Cookies.get("token");
    const role = Cookies.get("role"); // 🔹 خواندن role جداگانه

    if (cookieUser && token) {
      try {
        const parsedUser: User = JSON.parse(cookieUser);
        setUser(parsedUser);
        setData(parsedUser);

        // ست کردن token در axios هدر
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        // اگر role در کوکی موجود است، آن را استفاده کن
        if (role && parsedUser.role !== role) {
          Cookies.set("role", parsedUser.role, { expires: 1, secure: true, sameSite: "Strict" });
        }
      } catch {
        setUser(null);
        setData(null);
        Cookies.remove("user");
        Cookies.remove("token");
        Cookies.remove("role");
      }
    }
  }, [setUser]);

  // 🔸 Login function
  const login = async (credentials: Credentials, isAdminLogin = false) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post("/api/personel/login", credentials);
      const user: User = res.data.user;
      const token: string = res.data.token;

      // 🔹 Role validation
      if (isAdminLogin && user.role !== "MANAGER") {
        const msg = "❌ فقط مدیران اجازه دسترسی دارند";
        setError(msg);
        toast.error(msg);
        setLoading(false);
        return;
      }

      // 🔹 Store token in axios
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // 🔹 Store in cookies
      Cookies.set("token", token, { expires: 1, secure: true, sameSite: "Strict" });
      Cookies.set("user", JSON.stringify(user), { expires: 1, secure: true, sameSite: "Strict" });
      Cookies.set("role", user.role, { expires: 1, secure: true, sameSite: "Strict" }); // 🔹 ذخیره role جداگانه

      setUser(user);
      setData(user);

      toast.success("ورود با موفقیت انجام شد ✅");

      // 🔹 Navigate based on role
      const roleRoutes: Record<User["role"], string> = {
        MANAGER: "/admin",
        USER: "/user",
        RECEPTION: "/reseption",
      };
      router.push(roleRoutes[user.role] || "/");
    } catch (err: any) {
      const message = err.response?.data?.message || "خطا در ورود";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // 🔸 Logout function
  const logout = () => {
    Cookies.remove("token");
    Cookies.remove("user");
    Cookies.remove("role"); // 🔹 حذف role هنگام خروج
    setUser(null);
    setData(null);
    toast.success("خروج با موفقیت انجام شد ✅");
    router.push("/login");
  };

  // 🔸 Register function
  const register = async (registerData: RegisterData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post("/api/auth/register", registerData);
      const user: User = res.data.user;
      setUser(user);
      setData(user);

      Cookies.set("user", JSON.stringify(user), { expires: 1, secure: true, sameSite: "Strict" });
      Cookies.set("role", user.role, { expires: 1, secure: true, sameSite: "Strict" }); // 🔹 ذخیره role جداگانه

      toast.success("ثبت‌نام با موفقیت انجام شد ✅");
    } catch (err: any) {
      const message = err.response?.data?.message || "خطا در ثبت‌نام";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    login,
    logout,
    register,
  };
};

export default useAuth;
