"use client";
import React, { useEffect, useState } from "react";
import "./style.scss";
import Card from "../Card/page";
import api from "@/libs/axios";

const DoctorsPresent = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const finddata = async () => {
    try {
      const res = await api.get("/api/doctors");
      setData(res.data); // ذخیره لیست پزشک‌ها
    } catch (err) {
      console.error("خطا در دریافت لیست پزشک‌ها:", err);
      setError("خطا در دریافت اطلاعات پزشک‌ها");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    finddata();
  }, []);

  return (
    <div
      className="
        flex flex-col justify-start items-center 
        w-full sm:w-[80%] md:w-[50%] lg:w-[35%] xl:w-[24%] 
        bg-amber-50/30 
        h-auto lg:h-[80vh] 
        rounded-2xl py-5 px-2
        mx-auto
      "
    >
      <div className="header_doctor flex justify-center text-white mb-3">
        <h1 className="text-base sm:text-lg md:text-xl">
          پزشکان حاضر در درمانگاه
        </h1>
      </div>

      <div className="flex flex-col justify-center items-start gap-6 mt-3 w-full px-2 overflow-y-auto lg:overflow-y-visible">
        {loading && (
          <p className="text-center text-sm text-gray-600">
            در حال بارگذاری...
          </p>
        )}
        {error && <p className="text-center text-red-500 text-sm">{error}</p>}

        {data.length === 0 && !loading && !error && (
          <p className="text-center text-gray-500 text-sm">
            هیچ پزشکی ثبت نشده است.
          </p>
        )}

        {data.map((doctor) => (
          <Card
            key={doctor.personnelId} // یا doctor._id بسته به API
            doctorId={doctor.personnelId}
            name={doctor.name}
          />
        ))}
      </div>
    </div>
  );
};

export default DoctorsPresent;
