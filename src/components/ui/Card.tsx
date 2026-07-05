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
      className={`bg-slate-800/80 border rounded-xl p-4 transition-colors ${
        highlighted
          ? "border-amber-500/50 shadow-amber-500/20 shadow-lg"
          : "border-slate-700/50 hover:border-slate-600"
      } ${onClick ? "cursor-pointer" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
