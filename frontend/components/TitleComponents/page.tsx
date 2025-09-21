import React from "react";
import "./style.scss";

interface TitleComponentsType {
  h1?: string;
  color?: string;
  classname:string ;
}

const TitleComponents = ({ h1, color , classname }: TitleComponentsType) => {
  return (
    <h1 style={{ color }} className={`text-3xl text-nowrap ${classname}`}>
      {h1}
    </h1>
  );
};

export default TitleComponents;
