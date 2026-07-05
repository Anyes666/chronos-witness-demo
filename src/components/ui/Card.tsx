// src/components/ui/Card.tsx
import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  highlighted?: boolean;
}

export function Card({ children, className = "", onClick, highlighted }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-slate-900/82 border rounded-xl p-4 text-slate-100 shadow-lg shadow-slate-950/20 transition-colors ${
        highlighted
          ? "border-amber-500/50 shadow-amber-500/20 shadow-lg"
          : "border-slate-700/60 hover:border-slate-500"
      } ${onClick ? "cursor-pointer" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
