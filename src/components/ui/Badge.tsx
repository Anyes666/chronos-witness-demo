// src/components/ui/Badge.tsx
import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info";
}

const variants = {
  default: "bg-slate-700 text-slate-300",
  success: "bg-emerald-900/50 text-emerald-400 border-emerald-700/50",
  warning: "bg-amber-900/50 text-amber-400 border-amber-700/50",
  danger: "bg-red-900/50 text-red-400 border-red-700/50",
  info: "bg-blue-900/50 text-blue-400 border-blue-700/50",
};

export function Badge({ children, variant = "default" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full border ${variants[variant]}`}
    >
      {children}
    </span>
  );
}
