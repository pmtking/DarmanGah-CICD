import React from "react";
import "./style.scss";
import Card from "../Card/page";

const DoctorsPresent = () => {
  return (
    <>
      <div
        className="
          flex flex-col justify-start items-center 
          w-full sm:w-[80%] md:w-[50%] lg:w-[35%] xl:w-[24%] 
          bg-amber-50/30 
          h-auto lg:h-[80vh] 
          rounded-2xl py-5 px-2
          mx-auto
        "
      >
        <div className="header_doctor flex justify-center text-white mb-3">
          <h1 className="text-base sm:text-lg md:text-xl">
            پزشکان حاضر در درمانگاه
          </h1>
        </div>

        <div className="flex flex-col justify-center items-start gap-6 mt-3 w-full px-2 overflow-y-auto lg:overflow-y-visible">
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
        </div>
      </div>
    </>
  );
};

export default DoctorsPresent;
