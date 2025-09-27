// ____________________ 💥 pmt king coding 💥  __________________//
// --------------- type  --------------- //

import api from "@/libs/axios";
import { useState } from "react";
import toast from "react-hot-toast";

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
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // ______________________ ✅ Create Service ____________________ //
  const createService = async (data: ClinicServiceType) => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.post("/api/service/add", data);
      toast.success(res.data.message || "سرویس با موفقیت ایجاد شد");
      return res.data.service as ClinicServiceType;
    } catch (err: any) {
      setError(err.response?.data?.message || "خطا در ایجاد سرویس");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ____________________ ✅ Get Services _____________________ //
  const getService = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/api/service");
      return res.data as ClinicServiceType[];
    } catch (err: any) {
      setError(err?.response?.data?.message || "خطا در گرفتن سرویس‌ها");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ____________________ ✅ Update Service _____________________ //
  const updateService = async (id: string, data: Partial<ClinicServiceType>) => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.put(`/api/service/${id}`, data);
      toast.success(res.data.message || "سرویس با موفقیت ویرایش شد");
      return res.data.service as ClinicServiceType;
    } catch (err: any) {
      setError(err.response?.data?.message || "خطا در ویرایش سرویس");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ____________________ ✅ Delete Service _____________________ //
  const deleteService = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.delete(`/api/service/${id}`);
      toast.success(res.data.message || "سرویس با موفقیت حذف شد");
      return res.data;
    } catch (err: any) {
      setError(err.response?.data?.message || "خطا در حذف سرویس");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ________________________ 🔳 Export Hook Functions _______________ //
  return { createService, getService, updateService, deleteService, loading, error };
};
