import React from "react";
import "./style.scss";
import Card from "../Card/page";
const DoctorsPresent = () => {
  return (
    <>
      <div className="flex flex-col justify-start items-center w-[24%] bg-amber-50/30 h-[80vh] rounded-2xl py-5 px-2">
        <div className="header_doctor flex justify-center text-white">
          <h1>پزشکان حاضر در درمانگاه</h1>
        </div>
        <div className="flex flex-col justify-center items-start gap-6 mt-3">
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
