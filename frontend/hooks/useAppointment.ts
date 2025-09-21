// _________________________ pmt coding ________________________ //

import api from "@/libs/axios";
import { useState } from "react";
import toast from "react-hot-toast";

interface AppointmentPayload {
  fullName: string;
  phoneNumber: string;
  insuranceType: string;
  nationalCode: string;
  doctorId: string;
  appointmentDate: string;
  appointmentTime: string;
}
export const useReserveAppointment = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const reserve = async (payload: AppointmentPayload) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await api.post("/api/appointment/add", payload);
      setSuccess(true);
      return res.data;
     
    } catch (err: any) {
      setError(err.response?.data?.message || "خطا در رزرو نوبت");
      return null;
    } finally {
      setLoading(false);
    }
  };
  return { reserve, loading, error, success };
};
