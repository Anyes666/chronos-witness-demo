// src/components/three/InteractionPrompt.tsx
// 接近可交互对象时的按键提示 UI (HTML Overlay)
import { useState, useEffect } from "react";
import { interactionState } from "./ThreeGameRoot";

export function InteractionPrompt() {
  const [target, setTarget] = useState(interactionState.current);

  useEffect(() => {
    interactionState.listener = setTarget;
    return () => {
      interactionState.listener = null;
    };
  }, []);

  if (!target) return null;

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
      <div className="bg-slate-900/90 border border-amber-500/50 rounded-xl px-6 py-3 text-center shadow-lg shadow-amber-500/20">
        <p className="text-sm text-amber-400 font-medium">{target.label}</p>
        <p className="text-xs text-slate-500 mt-1">
          按 <span className="text-amber-500 font-mono">E</span> 交互
        </p>
      </div>
    </div>
  );
}
