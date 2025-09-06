"use client";
import React, { useState } from "react";
import "./style.scss";
import Button from "../Button/page";
import Modal from "../Modal/page";
import ModaleHeader from "../ModaleHeader/page";
import ModaleContect from "../ModaleContect/page";
const AboutBox = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const doctors = [
    {
      name: "دکتر سارا رضایی",
      image: "https://via.placeholder.com/80",
      bookingLink: "https://example.com/booking/sara",
    },
    {
      name: "دکتر علی موسوی",
      image: "https://via.placeholder.com/80",
      bookingLink: "https://example.com/booking/ali",
    },
    {
      name: "دکتر علی موسوی",
      image: "https://via.placeholder.com/80",
      bookingLink: "https://example.com/booking/ali",
    },
    {
      name: "دکتر علی موسوی",
      image: "https://via.placeholder.com/80",
      bookingLink: "https://example.com/booking/ali",
    },
    {
      name: "دکتر علی موسوی",
      image: "https://via.placeholder.com/80",
      bookingLink: "https://example.com/booking/ali",
    },
    {
      name: "دکتر علی موسوی",
      image: "https://via.placeholder.com/80",
    },
  ];
  return (
    <>
      <div className="about_box">
        <div className="about_box_header">
          <h1 className="text-center text-4xl text-white">
            درمانگاه فرهنگیان نیشابور
          </h1>
        </div>
        <div className="px-2">
          <p className="text-center text-white mt-3 py-10 border-b">
            لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با
            استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و مجله در
            ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و
            کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد کتابهای زیادی
            در شصت و سه درصد گذشته حال و آینده شناخت فراوان جامعه و متخصصان را
            می طلبد
          </p>
        </div>
        <div className="flex gap-2 px-2 mt-10">
          <Button name="تماس با ما " className="btn-yellow-important" />
          <Button name="رزرو نوبت " onClick={() => setIsModalOpen(true)} />
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title=" بخش رزرو نوبت "
          >
            <ModaleHeader />
            {/* <ModaleContect data={doctors} /> */}
          </Modal>
        </div>
      </div>
    </>
  );
};

export default AboutBox;
