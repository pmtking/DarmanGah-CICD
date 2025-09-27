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
export interface User {
  id: string;
  username: string;
  name: string;
  role: "ADMIN" | "USER" | "RECEPTION";
}

interface Credentials {
  userName: string;
  password: string;
}

interface RegisterData {
  name?: string;
  number: string;
  password: string;
  role: "ADMIN" | "USER" | "RECEPTION";
}

// =======================
// 🔹 useAuth Hook
// =======================
const useAuth = () => {
  const [data, setData] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { setUser } = useUser();
  const router = useRouter();

  // 🔸 Load user from cookies on mount
  useEffect(() => {
    const cookieUser = Cookies.get("user");
    if (cookieUser) {
      try {
        const parsedUser: User = JSON.parse(cookieUser);
        setUser(parsedUser);
        setData(parsedUser);
      } catch {
        setUser(null);
        setData(null);
        Cookies.remove("user");
      }
    }
  }, [setUser]);

  // 🔸 Login function
  const login = async (credentials: Credentials) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post("/api/personel/login", credentials);

      const user: User = res.data.user;
      const token: string = res.data.token;

      // Set user state
      setUser(user);
      setData(user);

      // Store token and user in cookies
      Cookies.set("token", token, { expires: 1, secure: true, sameSite: "Strict" });
      Cookies.set("user", JSON.stringify(user), { expires: 1, secure: true, sameSite: "Strict" });

      toast.success("ورود با موفقیت انجام شد ✅");

      // Redirect based on role
      const roleRoutes: Record<User["role"], string> = {
        ADMIN: "/admin",
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

  // 🔸 Register function
  const register = async (registerData: RegisterData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post("/api/auth/register", registerData);

      const user: User = res.data.user;
      setUser(user);
      setData(user);

      // Store user in cookies
      Cookies.set("user", JSON.stringify(user), { expires: 1, secure: true, sameSite: "Strict" });

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
    register,
  };
};

export default useAuth;
