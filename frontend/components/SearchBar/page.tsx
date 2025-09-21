import React, { useState } from "react";
import "./style.scss";
import { SearchNormal1 } from "iconsax-reactjs";
import InputSearch from "../InputSearch/page";

const SearchBar = () => {
  const [showInput, setShowInput] = useState(false);

  return (
    <>
      <div className="flex justify-center items-center gap-2 ">
        <button
          className="flex justify-center items-center px-2 py-2 icon rounded-2xl"
          onClick={() => setShowInput(!showInput)}
        >
          <SearchNormal1 size={26} />
        </button>
        {showInput && <InputSearch />}
      </div>
    </>
  );
};

export default SearchBar;
