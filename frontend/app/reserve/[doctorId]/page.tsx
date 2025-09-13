"use client";
import SelectCard from "@/components/SelectCard/page";
import { useParams, useSearchParams } from "next/navigation";

export default function ReservePage() {
  const params = useParams<{ doctorId: string }>();
  const searchParams = useSearchParams();

  const doctorId = params.doctorId;
  const day = searchParams.get("day");
  const time = searchParams.get("time");

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4 text-center">رزرو نوبت</h1>
      <p className="text-center text-gray-600 mb-4">
        شما نوبت روز <span className="font-bold">{day}</span> ساعت{" "}
        <span className="font-bold">{time}</span> را انتخاب کرده‌اید ✅
      </p>

      <SelectCard doctorId={doctorId} />
    </div>
  );
}
