// ____________________ 💥 pmt king coding 💥  __________________//
// --------------- type  --------------- //

import api from "@/libs/axios";
import { AnyARecord } from "node:dns";
import { useState } from "react";
import toast from "react-hot-toast";
import { flattenError } from "zod/v4/core";
import { fi } from "zod/v4/locales";

export interface Insurance {
  companyName: string;
  contractPrice: number;
}

export interface ClinicServiceType {
  serviceCode: string;
  serviceName: string;
  serviceGroup: string;
  pricePublic: number;
  priceGovernmental: number;
  baseInsurances: Insurance[];
  supplementaryInsurances: Insurance[];
  isFreeForStaff: boolean;
  _id?: string;
}

export const useService = () => {
  const [loading, setLoading] = useState<Boolean>(false);
  const [error, setError] = useState<string | null>(null);

  //   ______________________  ✅ create seruvse ____________________ //
  const createService = async (data: ClinicServiceType) => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.post("/api/service/add", data);

      toast.success(res.data.message);
      return res.data.service as ClinicServiceType;
    } catch (err: any) {
      setError(err.response?.data?.messgae || "خطا در ایجاد سروریس");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  //   ____________________  get Service _____________________ //
  const getService = async () => {
    try {
      setLoading(true);
      setError(null);

      // ✅ باید await بذاری
      const res = await api.get("/api/service");

      console.log("---------- res", res.data);

      // فرض می‌کنیم بک‌اندت چیزی مثل { services: [...] } برمی‌گردونه
      return res.data as ClinicServiceType[];
    } catch (err: any) {
      setError(err?.response?.data?.message || "خطا در گرفتن سرویس‌ها");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  //   ________________________  🔳 export function on hooks _______________ //
  return { createService, loading, error, getService };
};
