import React, { forwardRef } from "react";
import { InputProps } from "@/types/globaltypes";

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = "text",
      onChange,
      validate,
      className = "",
      placeholder = "",
      value,
      name,
      error,
      id,
      ...rest
    },
    ref
  ) => {
    return (
      <div className="flex flex-col gap-1 w-full">
        <input
          ref={ref}
          type={type}
          onChange={onChange}
          value={value}
          name={name}
          id={id}
          placeholder={placeholder}
          className={`p-3 rounded-xl border border-gray-300 focus:border-blue-500 placeholder:font-light placeholder:text-sm focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 text-black ${className}`}
          {...rest}
        />
        {error && (
          <span className="text-red-500 text-sm animate-pulse">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
