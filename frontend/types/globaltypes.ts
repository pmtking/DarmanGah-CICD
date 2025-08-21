import { JSX } from "react";

// button
export interface ButtonProps {
  name?: string;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset" | "link";
  loading?: boolean;
  disabled?: boolean;
  href?: any;
}
// inputs
export interface InputProps {
  type: "text" | "email" | "password" | "number" | "tel" | "url";
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  validate?: (value: string) => boolean;
  className?: string;
  placeholder?: string;
  value?: string;
  name?: string;
  error?: string;
  id?: string;
}

// inputs
export interface InputSearch {
  icon?: JSX.Element;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export type useGlobalRemoveClass = {
  id: string;
  className: string;
};

export type NavItemtype = {
  name: string;
  link: string;
  icon?: JSX.Element;
};

// header

export type HeaderType = {
  text?: string;
  size?: string;
};


