import Image from "next/image";
import React from "react";

interface CardDrType {
  bg: string;
  img?: string;
  name: string;
  specialty: string;
}

const CardDr: React.FC<CardDrType> = ({ bg, img, name, specialty }) => {
  return (
    <div
      className="group relative w-40 h-56 rounded-xl overflow-hidden shadow-md cursor-pointer transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl"
    >
      {/* بک‌گراند */}
      <Image
        src={bg}
        alt="background"
        fill
        className="object-cover"
      />

      {/* لایه مشکی برای خوانایی */}
      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-300" />

      {/* محتوای کارت */}
      <div className="relative flex flex-col items-center justify-end h-full p-3 text-center">
        {img && (
          <Image
            src={img}
            alt={name}
            width={64}
            // height={64}   // ✅ عرض و ارتفاع برابر برای دایره کامل
            className="rounded-full border-2 border-white shadow-lg object-cover transform transition-transform duration-300 group-hover:scale-110 group-hover:shadow-2xl"
          />
        )}
        <h3 className="mt-2 text-white font-semibold text-sm truncate w-full">
          {name}
        </h3>
        <p className="text-gray-200 text-xs truncate w-full">{specialty}</p>
      </div>
    </div>
  );
};

export default CardDr;
