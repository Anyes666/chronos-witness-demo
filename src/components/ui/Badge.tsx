// src/components/ui/Badge.tsx
import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info";
}

const variants = {
  default: "bg-slate-800 text-slate-200 border-slate-600/70",
  success: "bg-emerald-900/55 text-emerald-200 border-emerald-600/55",
  warning: "bg-amber-900/55 text-amber-200 border-amber-600/55",
  danger: "bg-red-900/55 text-red-200 border-red-600/55",
  info: "bg-blue-900/55 text-blue-200 border-blue-600/55",
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
