// src/components/ui/Modal.tsx
import type { ReactNode } from "react";
import { Button } from "./Button";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full mx-4 max-h-[85vh] overflow-y-auto shadow-2xl">
        {title && (
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
            <h2 className="text-lg font-semibold text-slate-200">{title}</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✕
            </Button>
          </div>
        )}
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
