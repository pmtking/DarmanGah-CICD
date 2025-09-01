// =======================
// 🔸 Type Definitions
// =======================

import api from "@/libs/axios";
import { useState } from "react";
import toast from "react-hot-toast";

export interface CreatePersonnelInput {
  name: string;
  nationalId: string;
  phone?: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
  role: "DOCTOR" | "NURSE" | "RECEPTION" | "MANAGER" | "SERVICE";
  salaryType: "FIXED" | "PERCENTAGE";
  percentageRate?: number;
  username: string;
  password: string;
  isActive?: boolean;
  hireAt?: string;
}

export interface Personnel {
  _id: string;
  name: string;
  nationalId: string;
  phone?: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
  role: string;
  salaryType: string;
  percentageRate?: number;
  username: string;
  isActive: boolean;
  hireAt: string;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

// پاسخ API هنگام افزودن پرسنل
interface AddPersonnelResponse {
  success: boolean;
  data: Personnel;
  message?: string;
}

// =======================
// 🔹 usePersonel Hook
// =======================

const usePersonel = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [personels, setPersonels] = useState<Personnel[]>([]);
  const [error, setError] = useState<string | null>(null);

  // دریافت لیست پرسنل‌ها
  const fetchPersonel = async () => {
    setLoading(true);
    try {
      const res = await api.get<Personnel[]>("/personnels");
      setPersonels(res.data);
    } catch (err: any) {
      setError(err.message);
      toast.error("خطا در دریافت پرسنل‌ها: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // افزودن پرسنل جدید
  const addPersonel = async (personelData: CreatePersonnelInput) => {
    setLoading(true);
    try {
      const res = await api.post<AddPersonnelResponse>("/api/personel/add", personelData);

      if (res.data.success) {
        setPersonels((prev) => [...prev, res.data.data]);
        toast.success("پرسنل با موفقیت اضافه شد!");
      } else {
        toast.error(res.data.message || "خطا در افزودن پرسنل");
      }

      console.log("پاسخ API:", res.data);
    } catch (err: any) {
      console.error("خطا در افزودن پرسنل:", err.message);
      setError(err.message);
      toast.error("خطا در افزودن پرسنل: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return { fetchPersonel, addPersonel, personels, loading, error };
};

export default usePersonel;
