import React from "react";
import "./style.scss";
import { HeaderType } from "@/types/globaltypes";
const Header = ({text , size }:HeaderType) => {
  return (
    <>
      <h1 className={`text-2xl`}>{text}</h1>
    </>
  );
};

export default Header;
