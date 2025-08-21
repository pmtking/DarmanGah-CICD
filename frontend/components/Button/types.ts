export interface ButtonProps {
  variant?: "primary" | "outline" | "danger";
  type?: "button" | "submit" | "reset" | "link";
  href?: string;
  className?: string;
  name: string;
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}


