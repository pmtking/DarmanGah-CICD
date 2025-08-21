"use client";
import React, { useState } from "react";
import "./style.scss";
import Image from "next/image";
import testImage from "@/public/images/image 8.png";
import Button from "../Button/page";
import Modal from "../Modal/page";
import { TickCircle } from "iconsax-reactjs";
import SelectCard from "../SelectCard/page";
interface CardTypy {
  image?: any;
  name?: string;
  href?: string;
}
const Card = ({ image, name, href }: CardTypy) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <div className="flex justify-center items-center gap-3 bg-white rounded-3xl px-2 ">
        <Image src={testImage} alt="" />
        <div className="text-nowrap">
          {(name && name) || "دکتر  جواد میر ی"}
        </div>
        <Button
          name="رزرو نوبت"
          className="btn-important"
          onClick={() => setIsOpen(true)}
        />
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title=" بخش رزرو نوبت "
        >
          <div className="flex flex-col gap-2">
            <div className="text-lg text-bold ">
              <h2>نوبت اینترنتی و مراجعه حضوری</h2>
            </div>
            <div className="flex flex-col items-center justify-center gap-3 border-1 border-[#071952] p-5 rounded-2xl">
              <div className="flex justify-start items-center gap-3 text-start w-full">
                <TickCircle />
                <p className="text-medium">زود ترین زمان نوبت</p>
              </div>
              <div className="flex justify-center items-center w-full">
                <SelectCard />
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default Card;
