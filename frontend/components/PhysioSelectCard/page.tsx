import Image from "next/image";
import React from "react";
import DefultAvatar from "@/public/images/nurce.png"; 
import { getStatusColor, getStatusText, PhysiotherapistData } from "../PhysiotherapyVisitForm/PhysiotherapistData";

interface PhysioSelectCardProps {
    data: PhysiotherapistData;
    isSelected: boolean;
    onClick: () => void;
}

const PhysioSelectCard: React.FC<PhysioSelectCardProps> = ({ data, isSelected, onClick }) => {
    const { name, status } = data;
    const statusColor = getStatusColor(status);
    const statusText = getStatusText(status);

    return (
        <div 
            onClick={onClick} 
            className="relative w-full h-80 flex flex-col items-center justify-end group cursor-pointer"
        >
            {/* --- بدنه اصلی کارت (لایه زیرین) --- */}
            <div className={`
                absolute bottom-0 inset-x-0 h-[70%] rounded-[2.5rem] transition-all duration-500 ease-out
                border-2 z-10
                ${isSelected 
                    ? "bg-white border-[#213448] shadow-[0_25px_50px_-12px_rgba(33,52,72,0.2)] scale-[1.05]" 
                    : "bg-white/80 border-slate-200 hover:border-slate-300 hover:shadow-xl group-hover:h-[77%]"
                }
            `}>
                {/* محتوای متنی */}
                <div className="absolute inset-x-0 bottom-6 text-center px-4 ">
                    <span className={`
                        text-[9px] font-black tracking-[0.2em] px-2 py-1 rounded-md transition-colors
                        ${isSelected ? "bg-[#213448] text-white" : "bg-slate-100 text-slate-400"}
                    `}>
                        PHYSIOTHERAPIST
                    </span>
                    <h3 className={`mt-3 text-lg font-black ${isSelected ? "text-slate-900" : "text-slate-700"}`}>
                        {name}
                    </h3>
                    <p className={`mt-1 text-[11px] font-bold ${isSelected ? "text-blue-600" : "text-slate-400"}`}>
                        {statusText}
                    </p>
                </div>
            </div>

            {/* --- بخش تصویر 3D (سرِ بیرون زده) --- */}
            <div className="absolute top-15 z-20 flex flex-col items-center overflow-visible">
                <div className={`
                    relative w-20 h-25 transition-all duration-500 transform
                    ${isSelected ? "scale-110 -translate-y-4" : "scale-100 group-hover:-translate-y-2"}
                `}>
                    
                    {/* ۱. دایره پس‌زمینه و خط دور (Border) که فقط نیمه پایین دارد یا تصویر را در بر می‌گیرد */}
                    <div className={`
                        absolute inset-0 rounded-full border-[3px] transition-all duration-500
                        ${isSelected ? "border-[#213448] bg-slate-50" : "border-white bg-slate-100"}
                        shadow-inner z-0
                    `} />

                    {/* ۲. ظرف تصویر با overflow-visible برای افکت خروج از کادر */}
                    <div className="absolute inset-0 z-10 overflow-visible">
                        <Image 
                            src={DefultAvatar} 
                            alt={name}
                            fill
                            className="object-cover rounded-full transform scale-125 origin-bottom"
                            style={{ 
                                // این بخش کلید طلایی است: 
                                // تصویر بزرگتر از دایره است اما پایین آن توسط لبه کارت پوشانده می‌شود
                                clipPath: 'none' 
                            }}
                        />
                    </div>

                    {/* نشانگر وضعیت */}
                    <div className={`
                        absolute bottom-1 right-2 w-7 h-7 rounded-full border-4 border-white shadow-lg z-30
                        flex items-center justify-center ${statusColor}
                    `}>
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    </div>
                </div>
            </div>

            {/* نشانگر تیک تایید */}
            {isSelected && (
                <div className="absolute top-[30%] right-4 z-30 animate-in zoom-in-50 duration-300">
                    <div className="bg-[#213448] p-1.5 rounded-full shadow-lg border-2 border-white">
                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PhysioSelectCard;