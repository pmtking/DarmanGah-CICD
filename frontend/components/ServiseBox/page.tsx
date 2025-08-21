import React from "react";
import "./style.scss";

interface ServiceBoxType {
  name?: string;
  href?: string;
}

const ServiceBox = ({ name, href }: ServiceBoxType) => {
  return (
    <div className="bg-amber-50/90 px-5 py-3 rounded-2xl text-sm ">
      {href ? (
        <a href={href} className="flex gap-2 justify-start items-center ">
          <span className="bg-green-400 p-1 rounded-full"></span>

          {name || "نام سرویس"}
        </a>
      ) : (
        <span>{name || "نام سرویس"}</span>
      )}
    </div>
  );
};

export default ServiceBox;
