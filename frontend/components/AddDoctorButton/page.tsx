"use client";

import { useRouter } from "next/navigation";

export default function AddDoctorButton() {
  const router = useRouter();

  const handleAddDoctor = () => {
    router.push("/admin/doctors/add"); // مسیر صفحه افزودن پزشک
  };

  return (
    <button
      onClick={handleAddDoctor}
      className="px-6 py-3 bg-[#071952] text-white rounded hover:bg-[#0a2a70] mb-4"
    >
      + افزودن پزشک
    </button>
  );
}
