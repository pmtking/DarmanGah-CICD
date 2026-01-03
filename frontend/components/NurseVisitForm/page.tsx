import ImageNur from "@/public/images/nurce.png";
import Image, { StaticImageData } from "next/image";
import { useState } from "react";

interface NurseVisitFormType {
  name: string;
  img?: StaticImageData;
}

interface ServiceType {
  id: string;
  title: string;
  price: number; // قیمت به تومان
}

const services: ServiceType[] = [
  { id: "injection", title: "تزریقات", price: 150000 },
  { id: "dressing", title: "پانسمان", price: 220000 },
  { id: "general_care", title: "مراقبت عمومی", price: 180000 },
  { id: "iv", title: "سرم‌تراپی", price: 250000 },
];

const NurseVisitForm = () => {
  const [selectedNurse, setSelectedNurse] = useState<NurseVisitFormType | null>(null);
  const [selectedServices, setSelectedServices] = useState<ServiceType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);

  const nrItem: NurseVisitFormType[] = [
    { name: "محسن سلیمی", img: ImageNur },
    { name: "زهرا احمدی", img: ImageNur },
  ];

  const nursesToShow = selectedNurse ? [selectedNurse] : nrItem;

  const toggleService = (svc: ServiceType) => {
    if (selectedServices.find((s) => s.id === svc.id)) {
      setSelectedServices(selectedServices.filter((s) => s.id !== svc.id));
    } else {
      setSelectedServices([...selectedServices, svc]);
    }
  };

  const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);

  const filteredServices = services.filter((svc) =>
    svc.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col w-full gap-4 rounded-2xl mt-5">
      {/* کارت پرستار */}
      <div className="w-full flex justify-between">
        {nursesToShow.map((item, key) => (
          <div
            key={key}
            className="relative flex w-[42%] cursor-pointer overflow-visible"
            onClick={() => {
              setSelectedNurse(item);
              setSelectedServices([]);
            }}
          >
            {item.img && (
              <Image
                src={item.img}
                alt={item.name}
                width={90}
                height={120}
                className="absolute -top-10 -right-12 opacity-80 z-0"
              />
            )}
            <div className="relative flex w-full justify-between items-center z-10 border-dashed border border-gray-400 bg-white/40 rounded-2xl px-2 py-2 shadow-xl">
              <p className="bg-blue-100 px-4 border border-blue-300 py-2 rounded-xl shadow-sm">
                {item.name}
              </p>
              {item.img && (
                <Image
                  src={item.img}
                  alt={item.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* پایین: دو بخش flex */}
      {selectedNurse && (
        <>
          <div className="flex flex-col md:flex-row w-full gap-6 mt-6">
            {/* بخش خدمات */}
            <div className="flex-1 p-4 border rounded-xl bg-white shadow-md">
              <h3 className="font-bold mb-3">انتخاب خدمت برای {selectedNurse.name}</h3>

              <input
                type="text"
                placeholder="جستجوی خدمت..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full mb-4 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />

              <div className="grid grid-cols-2 gap-3">
                {filteredServices.length > 0 ? (
                  filteredServices.map((svc) => (
                    <button
                      key={svc.id}
                      onClick={() => toggleService(svc)}
                      className={`px-4 py-2 rounded-lg border transition-all
                        ${
                          selectedServices.find((s) => s.id === svc.id)
                            ? "bg-blue-100 border-blue-500"
                            : "bg-gray-50 border-gray-300 hover:bg-gray-100"
                        }`}
                    >
                      {svc.title}
                    </button>
                  ))
                ) : (
                  <p className="text-gray-500 col-span-2">خدمتی یافت نشد.</p>
                )}
              </div>
            </div>

            {/* بخش موارد انتخابی و قیمت */}
            <div className="flex-1 p-4 border rounded-xl bg-white shadow-md">
              <h3 className="font-bold mb-3">موارد انتخابی</h3>
              {selectedServices.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {selectedServices.map((svc) => (
                    <div
                      key={svc.id}
                      className="flex justify-between items-center border-b pb-1"
                    >
                      <span>{svc.title}</span>
                      <span className="text-sm text-gray-700">
                        {svc.price.toLocaleString("fa-IR")} تومان
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center font-bold mt-2">
                    <span>مجموع</span>
                    <span>{totalPrice.toLocaleString("fa-IR")} تومان</span>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">هنوز خدمتی انتخاب نشده است.</p>
              )}
            </div>
          </div>

          {/* دکمه حساب */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition"
            >
              حساب
            </button>
          </div>
        </>
      )}

      {/* مدال */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] md:w-[50%]">
            <h2 className="text-xl font-bold mb-4">جزئیات حساب</h2>

            <p className="mb-2">پرستار انتخابی: {selectedNurse?.name}</p>

            <div className="mb-4">
              <h3 className="font-semibold mb-2">خدمات انتخابی:</h3>
              {selectedServices.length > 0 ? (
                <ul className="list-disc pl-5">
                  {selectedServices.map((svc) => (
                    <li key={svc.id}>
                      {svc.title} - {svc.price.toLocaleString("fa-IR")} تومان
                    </li>
                  ))}
                </ul>
              ) : (
                <p>هیچ خدمتی انتخاب نشده است.</p>
              )}
            </div>

            <div className="font-bold mb-4">
              مجموع: {totalPrice.toLocaleString("fa-IR")} تومان
            </div>

            {/* دکمه‌ها */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                چاپ
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NurseVisitForm;
