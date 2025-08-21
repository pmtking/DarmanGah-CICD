import React from "react";
import "./style.scss";
import {SearchNormal1 } from "iconsax-reactjs";
import InputSearch from "../InputSearch/page";
const SearchBar = () => {

  return (
    <>
        <div className="flex justify-center items-center gap-2">
          <div className="flex  justify-center items-center px-2 py-2 icon rounded-2xl">
            <SearchNormal1 size={26} />
          </div>
          <InputSearch />
        </div>
    </>
  );
};

export default SearchBar;
