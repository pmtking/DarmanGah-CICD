"use client";

import { useEffect, useState } from "react";
import TitleComponents from "@/components/TitleComponents/page";
import { ClinicServiceType, Insurance, useService } from "@/hooks/useServies";

const ServicePage = () => {
  const { loading, error, getService, deleteService, updateService } = useService();
  const [services, setServices] = useState<ClinicServiceType[]>([]);
  const [searchName, setSearchName] = useState("");
  const [searchCode, setSearchCode] = useState("");

  // مدال‌ها و فرم
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ClinicServiceType | null>(null);
  const [editForm, setEditForm] = useState({
    serviceName: "",
    pricePublic: 0,
    priceGovernmental: 0,
    baseInsurances: [] as Insurance[],
    supplementaryInsurances: [] as Insurance[],
  });

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

  const filteredServices = services.filter(
    (srv) =>
      srv.serviceName.toLowerCase().includes(searchName.toLowerCase()) &&
      srv.serviceCode.toLowerCase().includes(searchCode.toLowerCase())
  );

  const openEditModal = (srv: ClinicServiceType) => {
    setSelectedService(srv);
    setEditForm({
      serviceName: srv.serviceName,
      pricePublic: srv.pricePublic,
      priceGovernmental: srv.priceGovernmental,
      baseInsurances: [...srv.baseInsurances],
      supplementaryInsurances: [...srv.supplementaryInsurances],
    });
    setEditModalOpen(true);
  };

  const openDeleteModal = (srv: ClinicServiceType) => {
    setSelectedService(srv);
    setDeleteModalOpen(true);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleInsuranceChange = (
    type: "baseInsurances" | "supplementaryInsurances",
    index: number,
    field: "companyName" | "contractPrice",
    value: string
  ) => {
    setEditForm((prev) => {
      const updated = [...prev[type]];
      updated[index] = {
        ...updated[index],
        [field]: field === "contractPrice" ? Number(value) : value,
      };
      return { ...prev, [type]: updated };
    });
  };

  const handleAddInsurance = (type: "baseInsurances" | "supplementaryInsurances") => {
    setEditForm((prev) => ({
      ...prev,
      [type]: [...prev[type], { companyName: "", contractPrice: 0 }],
    }));
  };

  const handleRemoveInsurance = (type: "baseInsurances" | "supplementaryInsurances", index: number) => {
    setEditForm((prev) => {
      const updated = [...prev[type]];
      updated.splice(index, 1);
      return { ...prev, [type]: updated };
    });
  };

  const handleEditSave = async () => {
    if (!selectedService) return;
    try {
      await updateService(selectedService._id!, editForm);
      setServices((prev) =>
        prev.map((s) => (s._id === selectedService._id ? { ...s, ...editForm } : s))
      );
      setEditModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!selectedService) return;
    try {
      await deleteService(selectedService._id!);
      setServices((prev) => prev.filter((s) => s._id !== selectedService._id));
      setDeleteModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="flex flex-col p-6 min-h-screen">
      <TitleComponents h1="لیست تعرفه‌های خدمت" classname="mt-3 text-center" color="#FFF" />

      {/* جستجو و افزودن */}
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
          onClick={() => location.replace("/admin/service/add")}
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
                  <td colSpan={9} className="py-6 text-gray-300">در حال بارگذاری...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={9} className="py-6 text-red-400">{error}</td>
                </tr>
              ) : filteredServices.length > 0 ? (
                filteredServices.map((srv) => (
                  <tr key={srv._id} className="border-b border-white/20 hover:bg-white/20 transition">
                    <td className="px-4 py-3">{srv.serviceCode}</td>
                    <td className="px-4 py-3">{srv.serviceName}</td>
                    <td className="px-4 py-3">{srv.serviceGroup}</td>
                    <td className="px-4 py-3">{srv.pricePublic.toLocaleString()} تومان</td>
                    <td className="px-4 py-3">{srv.priceGovernmental.toLocaleString()} تومان</td>
                    <td className="px-4 py-3">
                      {srv.baseInsurances.map((b) => (
                        <div key={b.companyName}>{b.companyName} ({b.contractPrice.toLocaleString()} تومان)</div>
                      ))}
                    </td>
                    <td className="px-4 py-3">
                      {srv.supplementaryInsurances.map((s) => (
                        <div key={s.companyName}>{s.companyName} ({s.contractPrice.toLocaleString()} تومان)</div>
                      ))}
                    </td>
                    <td className="px-4 py-3">{srv.isFreeForStaff ? "✅" : "❌"}</td>
                    <td className="px-4 py-3 flex gap-2 justify-center">
                      <button onClick={() => openEditModal(srv)} className="px-3 py-1 text-xs bg-blue-500/80 hover:bg-blue-600 rounded-md text-white transition">ویرایش</button>
                      <button onClick={() => openDeleteModal(srv)} className="px-3 py-1 text-xs bg-red-500/80 hover:bg-red-600 rounded-md text-white transition">حذف</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="py-6 text-gray-300">هیچ خدمتی یافت نشد.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* مدال ویرایش حرفه‌ای */}
      {editModalOpen && selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-xl font-bold mb-4 text-center">ویرایش سرویس</h2>

            <div className="space-y-3">
              <input type="text" name="serviceName" value={editForm.serviceName} onChange={handleEditChange} placeholder="نام سرویس" className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" />
              <div className="flex gap-2">
                <input type="number" name="pricePublic" value={editForm.pricePublic} onChange={handleEditChange} placeholder="تعرفه آزاد" className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" />
                <input type="number" name="priceGovernmental" value={editForm.priceGovernmental} onChange={handleEditChange} placeholder="تعرفه دولتی" className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" />
              </div>
            </div>

            {/* بیمه‌ها */}
            <div className="mt-4">
              <h3 className="font-semibold mb-2">بیمه‌های پایه</h3>
              {editForm.baseInsurances.map((b, i) => (
                <div key={i} className="flex gap-2 mb-2 items-center">
                  <input type="text" value={b.companyName} onChange={(e) => handleInsuranceChange("baseInsurances", i, "companyName", e.target.value)} placeholder="نام بیمه" className="flex-1 px-2 py-1 border rounded-md" />
                  <input type="number" value={b.contractPrice} onChange={(e) => handleInsuranceChange("baseInsurances", i, "contractPrice", e.target.value)} placeholder="قیمت" className="w-24 px-2 py-1 border rounded-md" />
                  <button onClick={() => handleRemoveInsurance("baseInsurances", i)} className="px-2 py-1 bg-red-500 text-white rounded-md">حذف</button>
                </div>
              ))}
              <button onClick={() => handleAddInsurance("baseInsurances")} className="px-3 py-1 bg-green-500 text-white rounded-md mb-3">افزودن بیمه پایه</button>

              <h3 className="font-semibold mb-2 mt-4">بیمه‌های تکمیلی</h3>
              {editForm.supplementaryInsurances.map((s, i) => (
                <div key={i} className="flex gap-2 mb-2 items-center">
                  <input type="text" value={s.companyName} onChange={(e) => handleInsuranceChange("supplementaryInsurances", i, "companyName", e.target.value)} placeholder="نام بیمه" className="flex-1 px-2 py-1 border rounded-md" />
                  <input type="number" value={s.contractPrice} onChange={(e) => handleInsuranceChange("supplementaryInsurances", i, "contractPrice", e.target.value)} placeholder="قیمت" className="w-24 px-2 py-1 border rounded-md" />
                  <button onClick={() => handleRemoveInsurance("supplementaryInsurances", i)} className="px-2 py-1 bg-red-500 text-white rounded-md">حذف</button>
                </div>
              ))}
              <button onClick={() => handleAddInsurance("supplementaryInsurances")} className="px-3 py-1 bg-green-500 text-white rounded-md mb-3">افزودن بیمه تکمیلی</button>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setEditModalOpen(false)} className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400">انصراف</button>
              <button onClick={handleEditSave} className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600">ذخیره</button>
            </div>
          </div>
        </div>
      )}

      {/* مدال حذف */}
      {deleteModalOpen && selectedService && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-lg font-bold mb-4 text-center">حذف سرویس</h2>
            <p className="text-center">آیا از حذف سرویس "{selectedService.serviceName}" مطمئن هستید؟</p>
            <div className="flex justify-center gap-2 mt-4">
              <button onClick={() => setDeleteModalOpen(false)} className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400">انصراف</button>
              <button onClick={handleDelete} className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600">حذف</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default ServicePage;
