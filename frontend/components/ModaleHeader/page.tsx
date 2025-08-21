import React from "react";
import "./style.scss";
import Button from "../Button/page";
const ModaleHeader = () => {
  return (
    <>
      <div className="flex justify-between items-center gap-[200px] border-b py-5 ">
        <p className="text-nowrap">دکتر های حاضر در درمانگاه در روز دوشنبه 4 تیر  1404</p>
        <Button name="ادامه مراحل" className="w-max" />
      </div>
    </>
  );
};

export default ModaleHeader;
