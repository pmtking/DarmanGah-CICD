import React from "react";
import Link from "next/link";
import clsx from "clsx";
import styles from "./style.module.scss";

type ButtonVariants = "primary" | "outline" | "danger";
type ButtonAs = "button" | "link";

interface BaseProps {
  name: string;
  variant?: ButtonVariants;
  className?: string;
  loading?: boolean;
  disabled?: boolean;
}

type ButtonAsLink = BaseProps & {
  as: "link";
  href: string;
};

type ButtonAsButton = BaseProps & {
  as?: "button";
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
};

type ButtonProps = ButtonAsLink | ButtonAsButton;

const Button: React.FC<ButtonProps> = (props) => {
  const {
    name,
    variant = "primary",
    className,
    loading = false,
    disabled = false,
  } = props;

  const isDisabled = loading || disabled;

  const buttonClass = clsx(
    styles.button,
    styles[variant],
    { [styles.disabled]: isDisabled },
    className
  );

  if (props.as === "link") {
    return (
      <Link
        href={props.href}
        className={buttonClass}
        aria-disabled={isDisabled}
      >
        {loading ? "در حال بارگذاری..." : name}
      </Link>
    );
  }

  return (
    <button
      type={props.type || "button"}
      className={buttonClass}
      onClick={props.onClick}
      disabled={isDisabled}
      aria-label={name}
    >
      {loading ? "در حال بارگذاری..." : name}
    </button>
  );
};

export default Button;
