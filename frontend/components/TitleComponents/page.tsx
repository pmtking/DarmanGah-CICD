import React from "react";
import "./style.scss";

interface TitleComponentsType {
  h1?: string;
  color?: string;
}

const TitleComponents = ({ h1, color }: TitleComponentsType) => {
  return (
    <h1 style={{ color }} className="text-3xl text-nowrap">
      {h1}
    </h1>
  );
};

export default TitleComponents;
