import React, { forwardRef } from "react";
import { InputHTMLAttributes } from "react";

// تعریف نوع ورودی‌ها
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  validate?: (value: string) => boolean;
}

// کامپوننت Input با پشتیبانی از ref و تمام ویژگی‌های HTML
const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = "text",
      onChange,
      onKeyDown,
      className = "",
      placeholder = "",
      value,
      name,
      id,
      error,
      validate,
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
          onKeyDown={onKeyDown}
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
