"use client";
import React, { useState } from "react";
import "./style.scss";
import Image from "next/image";
import Button from "../Button/page";
import Modal from "../Modal/page";
import { TickCircle } from "iconsax-reactjs";
import SelectCard from "../SelectCard/page";

interface CardType {
  doctorId: string;
  name: string;
  avatarUrl?: string;
  specialty?: string;
  phone?: string;
}

const Card = ({ doctorId, name, avatarUrl, specialty, phone }: CardType) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        className="
          flex flex-wrap sm:flex-nowrap justify-start items-center 
          gap-3 bg-white rounded-3xl px-4 py-3 w-full 
          max-w-full overflow-hidden
        "
      >
        <div className="w-16 h-16 flex-shrink-0">
          <Image
            src={avatarUrl || "/images/image 8.png"} // fallback image
            alt="doctor"
            className="rounded-full object-cover"
            width={64}
            height={64}
          />
        </div>

        <div className="flex-grow text-sm sm:text-base text-gray-800">
          <p className="font-bold">{name}</p>
          {specialty && <p className="text-xs text-gray-500 mt-1">{specialty}</p>}
        </div>

        <div className="w-full sm:w-auto mt-2 sm:mt-0">
          <Button
            name="رزرو نوبت"
            className="btn-important w-full sm:w-auto"
            onClick={() => setIsOpen(true)}
          />
        </div>

        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="بخش رزرو نوبت"
        >
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-bold">نوبت اینترنتی و مراجعه حضوری</h2>
            <div className="flex flex-col items-center justify-center gap-3 border border-[#071952] p-5 rounded-2xl">
              <div className="flex justify-start items-center gap-3 w-full">
                <TickCircle />
                <p className="text-medium">زودترین زمان نوبت</p>
              </div>
              <div className="w-full">
                <SelectCard doctorId={doctorId} />
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default Card;
