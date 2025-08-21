import React, { forwardRef } from "react";
import { InputProps } from "@/types/globaltypes";

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type,
      onChange,
      validate,
      className,
      placeholder,
      value,
      name,
      error,
      id,
    },
    ref
  ) => {
    return (
      <div className="input">
        {type === "text" && (
          <>
            <input
              // ref={ref}
              type="text"
              onChange={onChange}
              className={` p-2 outline-0 rounded-2xl ${className}`}
              placeholder={placeholder}
              value={value}
              name={name}
              id={id}
            />
            {error && <span className="text-red-500">{error}</span>}
          </>
        )}
      </div>
    );
  }
);

Input.displayName = "Input"; // اضافه‌شدن برای جلوگیری از هشدار React DevTools

export default Input;
