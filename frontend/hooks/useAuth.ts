"use client";

import { useUser } from "@/context/UserContext";
import api from "@/libs/axios";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

// =======================
// 🔸 Type Definitions
// =======================
interface User {
  id: string;
  username: string;
  name: string;
  role: "ADMIN" | "USER" | "RECEPTION"; // ✅ اصلاح شد
}

interface Credentials {
  userName: string;
  password: string;
}

interface RegisterData {
  name?: string;
  number: string;
  password: string;
  role: "ADMIN" | "USER" | "RECEPTION"; // ✅ اصلاح شد
}

// =======================
// 🔹 useAuth Hook
// =======================
const useAuth = () => {
  const [data, setData] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | boolean>(false);
  const { setUser } = useUser();
  const router = useRouter();

  // 🔸 Fetch current user on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await api.get("/api/auth/user");
        setData(res.data);
        setUser(res.data.user);
      } catch (err: any) {
        setError(err.message || "خطا در دریافت اطلاعات کاربر");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [setUser]);

  // 🔸 Login function
  const login = async (credentials: Credentials) => {
    try {
      setLoading(true);
      const res = await api.post("/api/personel/login", credentials);

      const user: User = res.data.user;
      const token: string = res.data.token;

      setUser(user);
      setData(user);

      Cookies.set("token", token, {
        expires: 1,
        secure: true,
        sameSite: "Strict",
      });

      toast.success("ورود با موفقیت انجام شد ✅");

      // ✅ مسیردهی بر اساس role
      const roleRoutes: Record<User["role"], string> = {
        ADMIN: "/admin",
        USER: "/user",
        RECEPTION: "/reseption", // دقت کن spelling درست باشه
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

  // 🔸 Register function
  const register = async (registerData: RegisterData) => {
    try {
      setLoading(true);
      const res = await api.post("/api/auth/register", registerData);

      setUser(res.data.user);
      setData(res.data.user);

      toast.success("ثبت‌نام با موفقیت انجام شد ✅");
    } catch (err: any) {
      setError(err.message || "خطا در ثبت‌نام");
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    data,
    register,
    login,
  };
};

export default useAuth;
