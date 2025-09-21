import React from "react";
import "./style.scss";
import ServiseBox from "../ServiseBox/page";
const Services = () => {
  return (
    <>
      <div className=" servise_box flex justify-center items-start gap-6 w-[20%] bg-amber-50/20 ">
        <div className="servise_box_right">
          <h1 className=" servise_box_right_h1 text-white font-normal ">
            برای رزرو نوبت از هر بخش روی ان کلیلک کنید
          </h1>
          <p className="servise_box_right_p">طرف قرار داد با تمامی بیمه ها</p>
        </div>
        <div className=" flex flex-col gap-3 absolute top-2 left-2">
          <ServiseBox name="دکتر عمومی" href="/doctors/general" />
          <ServiseBox name=" پزشک متخصص" href="/doctors/specialist" />
          <ServiseBox name="دندانپزشکی " href="/doctors/dentist" />
          <ServiseBox name=" ازمایشگاه" href="/lab" />
          <ServiseBox name=" فیزیو تراپی " href="/" />
          
          <ServiseBox name=" بینایی سنجی و تجویز عینک" href="/" />
          <ServiseBox name="مامائی " href="/" />
          <ServiseBox name=" شنوایی سنجی" href="/" />
          <ServiseBox name=" کار درمانی" href="/" alertMessage="در ساعات 8 الی 10 و عصر ها 16 الی 17  جهت معاینه و اخذ نوبت  به صورت حضوری مراجعه فرمایید " />
          <ServiseBox name="  تزریقات " href="/" />
          <ServiseBox name=" گفتار درمانی" href="/" />
          <ServiseBox name="  رادیو لوژی " href="/" />
        </div>
      </div>
    </>
  );
};

export default Services;
