import React from "react";
import "./style.scss";
import toast from "react-hot-toast";

interface ServiceBoxType {
  name?: string;
  href?: string;
  alertMessage?: string; // پیام alert برای کلیک
}

const ServiceBox = ({ name, href, alertMessage }: ServiceBoxType) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (alertMessage) {
      e.preventDefault(); // جلوگیری از رفتن به لینک
      toast(alertMessage);
    }
  };

  return (
    <div className="bg-amber-50/90 px-5 py-3 rounded-2xl text-sm">
      {href ? (
        <a
          href={href}
          onClick={handleClick}
          className="flex gap-2 justify-start items-center cursor-pointer"
        >
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
