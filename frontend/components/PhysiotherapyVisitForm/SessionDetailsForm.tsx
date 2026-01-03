import React, { useState, useMemo } from 'react';

// ------------------ Type/Interface و Mock Data (بدون تغییر) ------------------
export interface TreatmentOption {
    id: string;
    label: string;
    pricePerUnit: number;
    unit: string;
}

interface SelectedTreatment {
    id: string;
    value: number;
}

interface PreviousSession {
    date: string;
    treatments: SelectedTreatment[];
    numBodyParts: number;
    isPaid: boolean;
    totalCost: number;
}

interface SessionDetailsFormProps {
    isOpen: boolean;
    onClose: () => void;
    totalPlannedSessions?: number;
    sessionsCompleted?: number;
    initialSessionFranchise?: number;
}

export const treatmentOptions: TreatmentOption[] = [
    { id: 'manual', label: 'درمان دستی', pricePerUnit: 15000, unit: 'دقیقه' },
    { id: 'laser', label: 'لیزر درمانی', pricePerUnit: 20000, unit: 'دقیقه' },
    { id: 'exercise', label: 'تمرین درمانی', pricePerUnit: 5000, unit: 'دقیقه' },
    { id: 'shockwave', label: 'شاک‌ویو', pricePerUnit: 300000, unit: 'جلسه' },
];

const previousSessions: PreviousSession[] = [
    {
        date: '۱۴۰۲/۰۵/۰۱',
        treatments: [{ id: 'manual', value: 20 }, { id: 'laser', value: 5 }],
        numBodyParts: 1,
        isPaid: true,
        totalCost: 550000,
    },
    {
        date: '۱۴۰۲/۰۴/۲۸',
        treatments: [{ id: 'manual', value: 15 }, { id: 'exercise', value: 30 }],
        numBodyParts: 2,
        isPaid: false,
        totalCost: 285000,
    },
];

const DEFAULT_TOTAL_SESSIONS = 10;
const DEFAULT_SESSIONS_COMPLETED = 5;
const DEFAULT_FRANCHISE = 50000;

// ------------------ کامپوننت کمکی: مدال جزئیات خدمات (مینیمال) ------------------

interface TreatmentDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedTreatments: SelectedTreatment[];
    handleTreatmentChange: (id: string, value: number) => void;
    serviceCost: number;
}

const TreatmentDetailsModal: React.FC<TreatmentDetailsModalProps> = ({
    isOpen,
    onClose,
    selectedTreatments,
    handleTreatmentChange,
    serviceCost
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 rtl">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative">

                <h3 className="text-lg font-bold mb-4 border-b pb-2">تنظیمات جزئیات درمان</h3>

                <button onClick={onClose} className="absolute top-3 left-3 text-gray-500 hover:text-gray-800">
                    بستن
                </button>

                <div className="space-y-3">
                    {selectedTreatments.map(treatment => {
                        const option = treatmentOptions.find(opt => opt.id === treatment.id);
                        if (!option) return null;

                        const itemTotal = treatment.value * option.pricePerUnit;

                        return (
                            <div key={treatment.id} className="flex justify-between items-center p-2 border rounded">
                                <label className="text-sm font-medium">{option.label}</label>
                                
                                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                    <span className="text-xs font-semibold w-20 text-left">
                                        {itemTotal.toLocaleString()} ت
                                    </span>
                                    <div className="flex items-center border rounded">
                                        <input
                                            type="number"
                                            value={treatment.value}
                                            onChange={(e) => handleTreatmentChange(treatment.id, Number(e.target.value))}
                                            min="0"
                                            className="w-12 text-center border-none p-1 text-sm"
                                        />
                                        <span className="text-xs p-1 border-l bg-gray-100">{option.unit}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-4 p-3 bg-gray-100 rounded text-right">
                    <div className="flex justify-between items-center">
                        <span className="font-bold">مجموع هزینه خدمات:</span>
                        <span className="text-base font-bold text-red-700">
                            {serviceCost.toLocaleString()} تومان
                        </span>
                    </div>
                </div>
                
                <button onClick={onClose} className="mt-4 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition">
                    تأیید
                </button>
            </div>
        </div>
    );
};


// ------------------ کامپوننت اصلی (مینیمال) ------------------

const SessionDetailsForm: React.FC<SessionDetailsFormProps> = ({
    isOpen,
    onClose,
    totalPlannedSessions = DEFAULT_TOTAL_SESSIONS,
    sessionsCompleted = DEFAULT_SESSIONS_COMPLETED,
    initialSessionFranchise = DEFAULT_FRANCHISE,
}) => {
    if (!isOpen) return null;

    // Stateها
    const [isTreatmentModalOpen, setIsTreatmentModalOpen] = useState(false);
    const [sessionFranchise, setSessionFranchise] = useState<number>(initialSessionFranchise);
    const [sessionNumber, setSessionNumber] = useState<number>(sessionsCompleted + 1);
    const [numBodyParts, setNumBodyParts] = useState<number>(1);
    const [isPaid, setIsPaid] = useState<boolean>(false);
    const [selectedTreatments, setSelectedTreatments] = useState<SelectedTreatment[]>(
        treatmentOptions.map(opt => ({ id: opt.id, value: opt.id === 'shockwave' ? 1 : 5 }))
    );

    // منطق محاسبه هزینه
    const serviceCost = useMemo(() => {
        return selectedTreatments.reduce((sum, treatment) => {
            const option = treatmentOptions.find(opt => opt.id === treatment.id);
            if (option) {
                return sum + (treatment.value * option.pricePerUnit);
            }
            return sum;
        }, 0);
    }, [selectedTreatments]);

    // هندلر تغییر جزئیات خدمات
    const handleTreatmentChange = (id: string, value: number) => {
        const newValue = Math.max(0, value);
        setSelectedTreatments(prev =>
            prev.map(t => (t.id === id ? { ...t, value: newValue } : t))
        );
    };

    // رندر جزئیات درمان قبلی
    const renderPreviousTreatment = (treatment: SelectedTreatment, options: TreatmentOption[]) => {
        const detail = options.find(opt => opt.id === treatment.id);
        if (detail) {
            return (
                <span key={treatment.id} className="text-xs text-gray-700 bg-gray-100 px-1 rounded ml-1">
                    {detail.label}: **{treatment.value}** {detail.unit}
                </span>
            );
        }
        return null;
    };
    
    // هندلر ثبت نهایی
    const handleSubmit = () => {
        console.log('Session Data:', {
            sessionNumber,
            numBodyParts,
            selectedTreatments,
            serviceCost,
            sessionFranchise,
            isPaid,
        });
        alert(`جزئیات جلسه ${sessionNumber} ثبت شد. مجموع هزینه: ${serviceCost.toLocaleString()} ت`);
        onClose();
    };

    // ------------------ ساختار Modal اصلی ------------------
    return (
        <div className="fixed inset-0 bg-gray-700/70 flex items-center justify-center z-40 p-4 rtl">
            
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 relative">

                <button onClick={onClose} className="absolute top-3 left-3 text-gray-500 hover:text-red-500">
                    X
                </button>

                <h3 className="text-xl font-bold text-blue-600 mb-6 text-center border-b pb-2">ثبت جلسه درمانی جدید</h3>

                <div className="space-y-6">

                    {/* اطلاعات جلسات طرح درمان */}
                    <div className="bg-blue-50 p-3 rounded-md border-r-4 border-blue-500">
                        <h4 className="font-semibold text-sm text-blue-800 mb-2">وضعیت کلی طرح</h4>
                        <div className="flex justify-between text-sm text-gray-700">
                            <p>کل: <span className="font-bold">{totalPlannedSessions}</span></p>
                            <p>انجام شده: <span className="font-bold text-red-500">{sessionsCompleted}</span></p>
                            <p>باقی مانده: <span className="font-bold text-green-600">{totalPlannedSessions - sessionsCompleted}</span></p>
                        </div>
                    </div>

                    {/* فیلدهای اصلی */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className='flex flex-col'>
                            <label className="text-xs font-medium text-gray-600 mb-1">شماره جلسه جاری</label>
                            <input
                                type="number"
                                value={sessionNumber}
                                onChange={(e) => setSessionNumber(Number(e.target.value))}
                                min="1"
                                className="border rounded p-2 text-sm text-center font-bold"
                            />
                        </div>

                        <div className='flex flex-col'>
                            <label className="text-xs font-medium text-gray-600 mb-1">تعداد اندام‌های درگیر (۱-۴)</label>
                            <input
                                type="number"
                                value={numBodyParts}
                                onChange={(e) => setNumBodyParts(Math.max(1, Math.min(4, Number(e.target.value))))}
                                min="1"
                                max="4"
                                className="border rounded p-2 text-sm text-center font-bold"
                            />
                        </div>
                    </div>

                    {/* دکمه باز کردن مدال جزئیات خدمات */}
                    <button
                        onClick={() => setIsTreatmentModalOpen(true)}
                        className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 transition font-bold text-sm"
                    >
                        تنظیم جزئیات خدمات | هزینه کل: {serviceCost.toLocaleString()} ت
                    </button>

                    {/* بخش پرداخت و فرانشیز */}
                    <div className="p-4 bg-yellow-50 rounded-md border border-yellow-300">
                        <div className="flex justify-between items-center mb-3">
                            <label className="text-sm font-medium text-gray-700">مبلغ فرانشیز:</label>
                            <div className="flex items-center">
                                <input
                                    type="number"
                                    value={sessionFranchise}
                                    onChange={(e) => setSessionFranchise(Number(e.target.value))}
                                    min="0"
                                    className="w-24 text-left border rounded p-1 text-sm font-bold text-red-600"
                                />
                                <span className="text-sm px-1 text-red-600">تومان</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-center pt-2 border-t border-yellow-200">
                            <label htmlFor="paymentStatus" className="text-sm font-medium text-gray-700">وضعیت پرداخت</label>
                            <div className="flex items-center">
                                <input
                                    id="paymentStatus"
                                    type="checkbox"
                                    checked={isPaid}
                                    onChange={(e) => setIsPaid(e.target.checked)}
                                    className="h-4 w-4 text-blue-500 border-gray-300 rounded ml-2"
                                />
                                <span className={`text-sm font-semibold ${isPaid ? 'text-green-600' : 'text-red-600'}`}>
                                    {isPaid ? 'تسویه شده' : 'بدهکار'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* تاریخچه جلسات قبلی (ساده‌تر) */}
                    <h4 className="text-sm font-bold text-gray-700 border-t pt-4">تاریخچه سوابق درمانی</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto border p-2 rounded">
                        {previousSessions.length > 0 ? (
                            previousSessions.map((session, index) => (
                                <div key={index} className={`border p-2 rounded text-xs ${session.isPaid ? 'bg-green-50' : 'bg-red-50'}`}>
                                    <div className="flex justify-between items-center mb-1">
                                        <p className="font-bold">تاریخ: {session.date}</p>
                                        <span className={`px-1 rounded ${session.isPaid ? 'bg-green-400 text-white' : 'bg-red-400 text-white'}`}>
                                            {session.isPaid ? 'تسویه' : 'بدهی'}
                                        </span>
                                    </div>
                                    <p>اندام: **{session.numBodyParts}** | هزینه: {session.totalCost.toLocaleString()} ت</p>
                                    <div className="flex flex-wrap items-center mt-1">
                                        {session.treatments.map(t => renderPreviousTreatment(t, treatmentOptions))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-xs text-gray-500 text-center">سوابقی یافت نشد.</p>
                        )}
                    </div>
                </div>

                {/* دکمه ثبت نهایی */}
                <button
                    onClick={handleSubmit}
                    className="mt-6 w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition font-bold text-lg"
                >
                    ثبت نهایی جلسه
                </button>

            </div>

            {/* رندر مدال جزئیات خدمات */}
            <TreatmentDetailsModal
                isOpen={isTreatmentModalOpen}
                onClose={() => setIsTreatmentModalOpen(false)}
                selectedTreatments={selectedTreatments}
                handleTreatmentChange={handleTreatmentChange}
                serviceCost={serviceCost}
            />
        </div>
    );
}

export default SessionDetailsForm;