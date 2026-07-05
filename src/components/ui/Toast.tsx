// src/components/ui/Toast.tsx
import { useEffect, useState } from "react";
import { feedbackStore, type ToastMessage } from "../../engine/feedbackStore";

const colors: Record<string, string> = {
  success: "border-emerald-500/50 bg-emerald-900/30 text-emerald-300",
  info: "border-blue-500/50 bg-blue-900/30 text-blue-300",
  warning: "border-amber-500/50 bg-amber-900/30 text-amber-300",
  error: "border-red-500/50 bg-red-900/30 text-red-300",
};

const icons: Record<string, string> = {
  success: "✓",
  info: "ℹ",
  warning: "⚠",
  error: "✕",
};

function ToastItem({ msg }: { msg: ToastMessage }) {
  return (
    <div
      className={`border rounded-xl px-4 py-2.5 text-sm shadow-lg backdrop-blur-sm flex items-center gap-2 pointer-events-auto ${colors[msg.type]}`}
      style={{ animation: "toast-in 0.2s ease-out" }}
    >
      <span className="text-base">{icons[msg.type]}</span>
      <span>{msg.text}</span>
    </div>
  );
}

export function ToastContainer() {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  useEffect(() => {
    return feedbackStore.subscribe(setMessages);
  }, []);

  if (messages.length === 0) return null;

  return (
    <>
      <style>{`
        @keyframes toast-in {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div className="fixed top-14 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-2 pointer-events-none">
        {messages.map((msg) => (
          <ToastItem key={msg.id} msg={msg} />
        ))}
      </div>
    </>
  );
}
