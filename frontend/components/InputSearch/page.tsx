import React from "react";
import "./style.scss";
import Input from "../Input/page";
const InputSearch = () => {
  return (
    <>
      <Input type="text" className=" w-80 input_search" placeholder="جستجو پزشک..." />
    </>
  );
};

export default InputSearch;
