// PhysiotherapistData.ts

// 1. تعریف رابط (Interface) برای ساختار داده‌ها
export interface PhysiotherapistData {
    id: string;
    name: string;
    // استفاده از Union Type برای محدود کردن مقادیر وضعیت
    status: 'online' | 'offline' | 'busy'; 
    isAvailable: boolean;
}

// 2. آرایه داده‌ها با تایپ مشخص (رفع تکرار ID)
export const physiotherapists: PhysiotherapistData[] = [
    {
        id: 'dr_majid',
        name: 'مجید باقری',
        status: 'online',
        isAvailable: true,
    },
    {
        // ID تصحیح شد تا منحصر به فرد باشد
        id: 'dr_hatameh',
        name: 'حاتمه اکبری',
        status: 'busy', // وضعیت 'busy' را برای نمایش تنوع استفاده می‌کنیم
        isAvailable: true,
    },
];

/**
 * تابع کمکی برای نگاشت وضعیت متنی به کلاس رنگی Tailwind
 * @param status وضعیت فیزیوتراپیست
 * @returns کلاس رنگی Tailwind
 */
export const getStatusColor = (status: PhysiotherapistData['status']): string => {
    switch (status) {
        case 'online':
            return 'bg-green-500';
        case 'busy':
            return 'bg-yellow-500';
        case 'offline':
            return 'bg-red-500';
        default:
            return 'bg-gray-400';
    }
};

/**
 * تابع کمکی برای نگاشت وضعیت متنی به متن نمایشی
 * @param status وضعیت فیزیوتراپیست
 * @returns متن وضعیت
 */
export const getStatusText = (status: PhysiotherapistData['status']): string => {
    switch (status) {
        case 'online':
            return 'در دسترس (Online)';
        case 'busy':
            return 'مشغول خدمت‌رسانی';
        case 'offline':
            return 'خارج از دسترس';
        default:
            return 'نامشخص';
    }
};

export interface TreatmentOption {
    id: string;
    label: string;
    unit: string; // مثال: "دقیقه", "جلسه", "نقطه"
    defaultValue: number;
}

export const treatmentOptions: TreatmentOption[] = [
    { id: 'manual', label: 'مانیپولاسیون/تکنیک‌های دستی', unit: 'دقیقه', defaultValue: 15 },
    { id: 'laser', label: 'لیزرتراپی پرتوان', unit: 'نقطه', defaultValue: 3 },
    { id: 'electro', label: 'الکتروتراپی/TENS', unit: 'دقیقه', defaultValue: 20 },
    { id: 'exercise', label: 'تمرین‌درمانی تحت نظر', unit: 'دقیقه', defaultValue: 30 },
];

export const bodyParts = [
    'گردن و شانه',
    'کمر و لگن',
    'زانو و مچ پا',
    'آرنج و مچ دست',
    'اندام فوقانی',
    'اندام تحتانی',
];

