// src/components/three/InteractionPrompt.tsx
// 接近可交互对象时的按键提示 UI (HTML overlay)
import { useState } from "react";

export function InteractionPrompt() {
  const [active, setActive] = useState(false);
  const [label, setLabel] = useState("");

  // 暴露给全局使用
  (window as unknown as Record<string, unknown>).__setInteractionPrompt = (
    show: boolean,
    text: string,
  ) => {
    setActive(show);
    setLabel(text);
  };

  if (!active) return null;

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
      <div className="bg-slate-900/90 border border-amber-500/50 rounded-xl px-6 py-3 text-center shadow-lg shadow-amber-500/20">
        <p className="text-sm text-amber-400">{label}</p>
        <p className="text-xs text-slate-500 mt-1">按 E 交互</p>
      </div>
    </div>
  );
}
