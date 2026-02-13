// PhysiotherapyVisitForm.tsx
import React, { useState, useMemo } from "react";
import { physiotherapists, PhysiotherapistData } from './PhysiotherapistData';
import PhysioSelectCard from "../PhysioSelectCard/page";
import SessionDetailsForm from "./SessionDetailsForm";

interface TreatmentFile {
    totalSessions: number;
    sessionsCompleted: number;
    initialSessionFranchise: number;
}

interface MockPatient {
    name: string;
    hasFile: boolean;
    treatmentFile: TreatmentFile | null;
}

const initialPatientState: MockPatient = {
    name: "آرش حسینی",
    hasFile: true,
    treatmentFile: {
        totalSessions: 10,
        sessionsCompleted: 5,
        initialSessionFranchise: 50000
    }
};

const PhysiotherapyVisitForm: React.FC = () => {
    const [selectedCard, setSelectedCard] = useState<string | null>(null);
    const [isSessionModalOpen, setIsSessionModalOpen] = useState<boolean>(false);
    const [patient] = useState<MockPatient>(initialPatientState);

    const selectedPhysio = useMemo(() =>
        physiotherapists.find(p => p.id === selectedCard),
        [selectedCard]);

    return (
        <div className="rtl text-right">

            {/* هدر ساده و مدرن */}
            <header className="mb-2 border-b">
                <h1 className="text-xl font-black text-gray-800 flex items-center gap-2">
                    <span className="bg-blue-600 text-white p-1.5 rounded-lg text-sm">👨‍⚕️</span>
                    پذیرش فیزیوتراپی
                </h1>
                <div className="flex flex-row-reverse w-full justify-between gap-2">
                    <div className=" top-0 mb-2 w-full">
                        <div className="bg-gray-900 text-white p-4 rounded-2xl shadow-3xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-white/10">
                            <div className="text-right">
                                {selectedPhysio ? (
                                    <div>
                                        <p className="text-[10px] text-gray-400">فیزیوتراپیست مسئول:</p>
                                        <p className="text-sm font-bold text-blue-400">{selectedPhysio.name}</p>
                                    </div>
                                ) : (
                                    <p className="text-xs text-gray-400 italic">لطفاً یک پزشک را انتخاب کنید...</p>
                                )}
                            </div>

                            <button
                                onClick={() => setIsSessionModalOpen(true)}
                                disabled={!selectedCard}
                                className="w-full sm:w-auto bg-blue-500 hover:bg-blue-400 disabled:bg-gray-700 disabled:text-gray-500 text-white px-8 py-3 rounded-xl font-bold text-sm transition-all active:scale-95 shadow-lg"
                            >
                                {patient.hasFile ? 'ثبت جلسه درمان' : 'تشکیل پرونده'}
                            </button>
                        </div>
                    </div>
                    <div className={`w-full mb-8 p-4 rounded-2xl border flex justify-between items-center ${patient.hasFile ? 'bg-blue-50/50 border-blue-100' : 'bg-red-50 border-red-100'
                        }`}>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">بیمار انتخاب شده:</p>
                            <h2 className="font-bold text-gray-900">{patient.name}</h2>
                        </div>
                        <div className="text-left">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${patient.hasFile ? 'bg-blue-600 text-white' : 'bg-red-600 text-white'
                                }`}>
                                {patient.hasFile ? 'پرونده فعال' : 'بدون پرونده'}
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            {/* کارت وضعیت بیمار - جمع‌وجور */}


            {/* بخش انتخاب فیزیوتراپیست - کارت‌های کوچک */}
            <section className="mb-10">
                <div className="flex justify-between items-end mb-4">
                    <h3 className="text-sm font-bold text-gray-700">۱. انتخاب فیزیوتراپیست</h3>
                    <span className="text-[10px] text-gray-400">اسکرول کنید ←</span>
                </div>

                <div className="flex  gap-3 pb-4 scrollbar-hide select-none">
                    {physiotherapists.map((physio) => (
                        <div key={physio.id} className="flex-shrink-0 w-32 md:w-36">
                            <PhysioSelectCard
                                data={physio}
                                isSelected={selectedCard === physio.id}
                                onClick={() => setSelectedCard(physio.id)}
                            />
                        </div>
                    ))}
                </div>
            </section>

            {/* فوتر اکشن - فیکس شده در پایین برای موبایل یا شناور در دسکتاپ */}

            {/* مدال ثبت جلسه */}
            <SessionDetailsForm
                isOpen={isSessionModalOpen}
                onClose={() => setIsSessionModalOpen(false)}
                totalPlannedSessions={patient.treatmentFile?.totalSessions || 0}
                sessionsCompleted={patient.treatmentFile?.sessionsCompleted || 0}
                initialSessionFranchise={patient.treatmentFile?.initialSessionFranchise || 0}
            />
        </div>
    );
}

export default PhysiotherapyVisitForm;