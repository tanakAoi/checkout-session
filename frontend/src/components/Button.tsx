import { Link } from "react-router-dom";

interface IBtnProps {
  linkTo?: string;
  children: string;
  className?: string;
  disabled?: boolean;
  selected?: boolean;
  size: "sm" | "md" | "lg" | "xl";
  color: "light" | "dark" | "transparent";
  event?: (e: any) => void;
}

const style = {
  sizes: {
    sm: "text-sm px-6",
    md: "text-base px-10",
    lg: "text-lg px-14",
    xl: "text-xl px-16",
  },
  colors: {
    light: `bg-leaf text-light border-transparent border-2 hover:bg-light hover:text-leaf hover:border-leaf hover:border-2`,
    dark: `bg-neutral-950 text-primary border-neutral-950 hover:bg-neutral-50 hover:text-primary`,
    transparent: `text-primary shadow-none bg-transparent border-none hover:bg-neutral-950 hover:text-primary`,
    darkSelected: `bg-neutral-950 text-primary border-neutral-950 hover:bg-neutral-950 hover:border-neutral-950`,
  },
};

export const Button = ({
  linkTo,
  children,
  className = "",
  disabled = false,
  selected = false,
  size = "md",
  color = "light",
  event,
}: IBtnProps) => {
  const buttonContent = (
    <button
      className={`
            btn
                ${className} 
                ${style.sizes[size]} 
                ${
                  selected
                    ? "selected" && style.colors.darkSelected
                    : style.colors[color]
                }
            `}
      disabled={disabled}
      onClick={event}
    >
      {children}
    </button>
  );

  return linkTo ? <Link to={linkTo}>{buttonContent}</Link> : buttonContent;
};
