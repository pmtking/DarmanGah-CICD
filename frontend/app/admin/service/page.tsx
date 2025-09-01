"use client";

import { useEffect, useState } from "react";
import TitleComponents from "@/components/TitleComponents/page";
import { ClinicServiceType, useService } from "@/hooks/useServies";

const ServicePage = () => {
  const { loading, error, getService } = useService();
  const [services, setServices] = useState<ClinicServiceType[]>([]);
  const [searchName, setSearchName] = useState("");
  const [searchCode, setSearchCode] = useState("");

  // دریافت داده‌ها
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getService();
        setServices(data);
      } catch (err) {
        console.error("خطا در گرفتن سرویس‌ها:", err);
      }
    };
    fetchData();
  }, []);

  // فیلتر کردن سرویس‌ها بر اساس جستجو
  const filteredServices = services.filter(
    (srv) =>
      srv.serviceName.toLowerCase().includes(searchName.toLowerCase()) &&
      srv.serviceCode.toLowerCase().includes(searchCode.toLowerCase())
  );

  return (
    <main className="flex flex-col p-6 min-h-screen">
      <TitleComponents
        h1="لیست تعرفه‌های خدمت"
        classname="mt-3 text-center"
        color="#FFF"
      />

      {/* سرچ و دکمه افزودن */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-6 mb-4">
        <div className="flex-1 flex gap-4 flex-col sm:flex-row">
          <input
            type="text"
            placeholder="جستجو بر اساس نام خدمت..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="flex-1 px-4 py-2 rounded-xl border border-white/30 bg-white/20 text-white placeholder-gray-300 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            placeholder="جستجو بر اساس کد خدمت..."
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
            className="flex-1 px-4 py-2 rounded-xl border border-white/30 bg-white/20 text-white placeholder-gray-300 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <button
          className="px-5 py-2 rounded-xl bg-green-500 hover:bg-green-600 text-white shadow-lg transition mt-2 sm:mt-0"
          onClick={() =>location.replace('/admin/service/add')}
        >
        افزودن سرویس
        </button>
      </div>

      {/* جدول */}
      <div className="overflow-x-auto mt-4">
        <div className="backdrop-blur-lg bg-white/30 border border-white/40 shadow-xl rounded-2xl overflow-hidden">
          <table className="w-full text-sm text-center text-white">
            <thead className="bg-white/10 backdrop-blur-sm text-gray-200">
              <tr>
                <th className="px-4 py-3">کد خدمت</th>
                <th className="px-4 py-3">نام خدمت</th>
                <th className="px-4 py-3">گروه</th>
                <th className="px-4 py-3">تعرفه آزاد</th>
                <th className="px-4 py-3">تعرفه دولتی</th>
                <th className="px-4 py-3">بیمه‌های پایه</th>
                <th className="px-4 py-3">بیمه‌های تکمیلی</th>
                <th className="px-4 py-3">رایگان برای پرسنل</th>
                <th className="px-4 py-3">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-6 text-gray-300">
                    در حال بارگذاری...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={9} className="py-6 text-red-400">
                    {error}
                  </td>
                </tr>
              ) : filteredServices.length > 0 ? (
                filteredServices.map((srv) => (
                  <tr
                    key={srv._id}
                    className="border-b border-white/20 hover:bg-white/20 transition"
                  >
                    <td className="px-4 py-3">{srv.serviceCode}</td>
                    <td className="px-4 py-3">{srv.serviceName}</td>
                    <td className="px-4 py-3">{srv.serviceGroup}</td>
                    <td className="px-4 py-3">
                      {srv.pricePublic.toLocaleString()} تومان
                    </td>
                    <td className="px-4 py-3">
                      {srv.priceGovernmental.toLocaleString()} تومان
                    </td>
                    <td className="px-4 py-3">
                      {srv.baseInsurances.map((b) => (
                        <div key={b.companyName}>
                          {b.companyName} ({b.contractPrice.toLocaleString()} تومان)
                        </div>
                      ))}
                    </td>
                    <td className="px-4 py-3">
                      {srv.supplementaryInsurances.map((s) => (
                        <div key={s.companyName}>
                          {s.companyName} ({s.contractPrice.toLocaleString()} تومان)
                        </div>
                      ))}
                    </td>
                    <td className="px-4 py-3">
                      {srv.isFreeForStaff ? "✅ بله" : "❌ خیر"}
                    </td>
                    <td className="px-4 py-3 flex gap-2 justify-center">
                      <button className="px-3 py-1 text-xs bg-blue-500/80 hover:bg-blue-600 rounded-md text-white transition">
                        ویرایش
                      </button>
                      <button className="px-3 py-1 text-xs bg-red-500/80 hover:bg-red-600 rounded-md text-white transition">
                        حذف
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="py-6 text-gray-300">
                    هیچ خدمتی یافت نشد.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default ServicePage;
