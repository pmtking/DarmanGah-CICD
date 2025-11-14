import { JSX, useState } from "react";
import { Heart, Activity, Scan } from "iconsax-reactjs";

interface Service {
    id: number;
    title: string;
    description: string;
    price: number;
    specialty: string;
    icon?: JSX.Element;
}

interface ServicesComponentProps {
    doctorSpecialty: string;
}

const ServicesComponent = ({ doctorSpecialty }: ServicesComponentProps) => {
    const [selectedServices, setSelectedServices] = useState<Service[]>([]);
    const [hasInsurance, setHasInsurance] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const services: Service[] = [
        { id: 1, title: "ویزیت پزشک عمومی", description: "ویزیت حضوری پزشک عمومی", price: 200000, specialty: "عمومی", icon: <Activity size="22" color="#6366F1" /> },
        { id: 2, title: "ویزیت پزشک متخصص قلب", description: "ویزیت حضوری پزشک متخصص قلب", price: 400000, specialty: "متخصص قلب", icon: <Heart size="22" color="#EF4444" /> },
        { id: 3, title: "آزمایش خون", description: "انجام آزمایش خون پایه", price: 150000, specialty: "عمومی", icon: <Activity size="22" color="#10B981" /> },
        { id: 4, title: "تصویربرداری مغز", description: "خدمات تصویربرداری پزشکی", price: 500000, specialty: "فوق تخصص مغز و اعصاب", icon: <Scan size="22" color="#F59E0B" /> },
    ];

    const toggleService = (service: Service) => {
        if (selectedServices.find((s) => s.id === service.id)) {
            setSelectedServices(selectedServices.filter((s) => s.id !== service.id));
        } else {
            setSelectedServices([...selectedServices, service]);
        }
    };

    const filteredServices =
        doctorSpecialty === "همه"
            ? services
            : services.filter((s) => s.specialty === doctorSpecialty);

    const totalPrice = hasInsurance
        ? selectedServices.reduce((sum, s) => sum + s.price, 0) * 0.5
        : selectedServices.reduce((sum, s) => sum + s.price, 0);

    const receiptNumber = Math.floor(Math.random() * 1000000);

    return (
        <div className="grid grid-cols-2 gap-6 text-sm">
            {/* لیست خدمات */}
            <div>
                <h2 className="font-semibold mb-3 text-indigo-600">✨ خدمات ({doctorSpecialty})</h2>
                <div className="space-y-3">
                    {filteredServices.length === 0 ? (
                        <p className="text-gray-400">هیچ خدمتی یافت نشد</p>
                    ) : (
                        filteredServices.map((service) => (
                            <div
                                key={service.id}
                                className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all duration-300 ${selectedServices.find((s) => s.id === service.id)
                                    ? "bg-indigo-100 border border-indigo-400 shadow-sm"
                                    : "bg-white border border-gray-200 hover:bg-gray-50 shadow-sm"
                                    }`}
                                onClick={() => toggleService(service)}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-gray-50">{service.icon}</div>
                                    <div className="flex flex-col">
                                        <span className="font-medium text-gray-800">{service.title}</span>
                                        <span className="text-xs text-gray-500">{service.description}</span>
                                        <span className="text-[10px] text-gray-600 border px-2 rounded-full w-fit mt-1">
                                            {service.specialty}
                                        </span>
                                    </div>
                                </div>
                                <span className="text-xs font-semibold text-indigo-600">
                                    {service.price.toLocaleString()} تومان
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* خدمات انتخابی */}
            <div>
                <h2 className="font-semibold mb-3 text-green-600">✅ انتخاب‌ها</h2>
                {selectedServices.length === 0 ? (
                    <p className="text-gray-400">هیچ انتخابی ندارید</p>
                ) : (
                    <div className="flex flex-col gap-2">
                        {selectedServices.map((service) => (
                            <div
                                key={service.id}
                                className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-200 shadow-sm"
                            >
                                <span className="text-gray-800 text-sm">{service.title}</span>
                                <button
                                    className="text-red-500 text-xs hover:underline"
                                    onClick={() => toggleService(service)}
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                        {/* جمع کل + دکمه‌ها */}
                        <div className="flex justify-between items-center mt-3 p-3 rounded-lg bg-indigo-50 border border-indigo-200 shadow-sm">
                            <span className="font-semibold text-gray-700">
                                جمع کل: {totalPrice.toLocaleString()} تومان
                            </span>
                            <div className="flex gap-2">
                                <button
                                    className={`px-2 py-1 rounded text-xs border shadow-sm ${hasInsurance
                                        ? "bg-green-100 text-green-700 border-green-300"
                                        : "bg-gray-100 text-gray-600 border-gray-300"
                                        }`}
                                    onClick={() => setHasInsurance(!hasInsurance)}
                                >
                                    {hasInsurance ? "✅ بیمه ثبت شد" : "ثبت بیمه"}
                                </button>
                                <button
                                    className="px-2 py-1 rounded text-xs bg-black text-white hover:bg-gray-800 shadow-sm"
                                    onClick={() => setShowModal(true)}
                                >
                                    ذخیره
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* مدال بخش‌بندی شده */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
                    <div className="bg-blue-50 rounded-2xl p-6 w-96 shadow-2xl border border-blue-200">
                        <h2 className="text-lg font-bold text-blue-700 mb-4">🧾 پیش‌نمایش فاکتور</h2>

                        {/* بخش اطلاعات بیمار */}
                        <div className="space-y-2 p-3 rounded-lg border border-blue-200 shadow-sm mb-3 bg-white">
                            <p className="text-gray-700"><span className="font-semibold">نام بیمار:</span> بیمار نمونه</p>
                            <p className="text-gray-700"><span className="font-semibold">شماره قبض:</span> {receiptNumber}</p>
                            <p className="text-gray-700"><span className="font-semibold">پزشک:</span> {doctorSpecialty}</p>
                        </div>

                        {/* بخش خدمات انتخابی */}
                        <div className="p-3 rounded-lg border border-blue-200 shadow-sm mb-3 bg-white">
                            <p className="font-semibold text-gray-700 mb-2">خدمات انتخابی:</p>
                            <ul className="list-disc pl-5 text-xs text-gray-600 space-y-1">
                                {selectedServices.map((s) => (
                                    <li key={s.id}>{s.title} - {s.price.toLocaleString()} تومان</li>
                                ))}
                            </ul>
                        </div>

                        {/* بخش بیمه و مبلغ نهایی */}
                        <div className="p-3 rounded-lg border border-blue-200 shadow-sm mb-3 bg-white">
                            <p className="text-gray-700"><span className="font-semibold">نوع بیمه:</span> {hasInsurance ? "تکمیلی" : "عادی"}</p>
                            <p className="text-gray-700"><span className="font-semibold">مبلغ نهایی:</span> {totalPrice.toLocaleString()} تومان</p>
                        </div>

                        {/* دکمه‌ها */}
                        <div className="flex justify-end gap-2 text-xs mt-4">
                            <button
                                className="px-3 py-1 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition border border-gray-300 shadow-sm"
                                onClick={() => setShowModal(false)}
                            >
                                بستن
                            </button>
                            <button
                                className="px-3 py-1 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition shadow-sm"
                                onClick={() => window.print()}
                            >
                                چاپ
                            </button>
                        </div>
                    </div>
                </div>
            )}


        </div>
    );
};

export default ServicesComponent;
