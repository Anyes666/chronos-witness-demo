// src/components/ui/Button.tsx
import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
}

const variants = {
  primary: "bg-amber-600 hover:bg-amber-500 text-white",
  secondary: "bg-slate-700 hover:bg-slate-600 text-slate-200 border border-slate-600",
  danger: "bg-red-800 hover:bg-red-700 text-red-100",
  ghost: "bg-transparent hover:bg-slate-800 text-slate-400",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm rounded-md",
  md: "px-4 py-2 text-base rounded-lg",
  lg: "px-6 py-3 text-lg rounded-xl",
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${variants[variant]} ${sizes[size]} font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer select-none ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
