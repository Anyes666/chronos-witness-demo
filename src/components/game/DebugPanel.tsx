// src/components/game/DebugPanel.tsx
// 开发环境调试面板 — 仅 import.meta.env.DEV 时渲染
import { useState, useEffect } from "react";
import { useGameStore } from "../../engine/gameStore";
import { interactionState } from "../three/ThreeGameRoot";
import { useIsMobile } from "./useIsMobile";
import type { InteractionTarget } from "../../engine/interactionEngine";

export function DebugPanel() {
  if (!import.meta.env.DEV) return null;

  const [visible, setVisible] = useState(false);
  const [nearby, setNearby] = useState<InteractionTarget | null>(null);
  const currentRound = useGameStore((s) => s.currentRound);
  const entropy = useGameStore((s) => s.entropy);
  const discovered = useGameStore((s) => s.discoveredEvidenceIds);
  const testimonyCount = useGameStore((s) => s.testimonyHistory.length);
  const endingId = useGameStore((s) => s.endingId);
  const isMobile = useIsMobile();

  useEffect(() => {
    const id = setInterval(() => {
      setNearby(interactionState.current);
    }, 200);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const toggle = (e: KeyboardEvent) => {
      if (e.key === "F3") {
        e.preventDefault();
        setVisible((v) => !v);
      }
    };
    window.addEventListener("keydown", toggle);
    return () => window.removeEventListener("keydown", toggle);
  }, []);

  if (!visible) {
    return (
      <div className="fixed bottom-2 left-2 z-[200] text-xs text-slate-600 pointer-events-auto">
        <button onClick={() => setVisible(true)} className="bg-slate-900/80 px-2 py-1 rounded">
          F3 Debug
        </button>
      </div>
    );
  }

  return (
    <div className="fixed top-12 right-2 z-[200] w-72 max-h-[80vh] overflow-y-auto bg-slate-950/95 border border-slate-700 rounded-xl p-4 text-xs font-mono text-slate-400 space-y-2 pointer-events-auto shadow-2xl">
      <div className="flex justify-between items-center">
        <span className="text-amber-400 font-bold">🔧 Debug</span>
        <button onClick={() => setVisible(false)} className="text-slate-600 hover:text-slate-400">✕</button>
      </div>

      <div className="border-t border-slate-800 pt-2 space-y-1">
        <p>Round: <span className="text-amber-400">{currentRound}</span></p>
        <p>Entropy: <span className="text-amber-400">{entropy}</span></p>
        <p>Evidence: <span className="text-emerald-400">{discovered.length}/6</span></p>
        <p>Testimonies: <span className="text-blue-400">{testimonyCount}</span></p>
        <p>Ending: <span className="text-purple-400">{endingId ?? "none"}</span></p>
        <p>Mobile: <span className="text-slate-500">{isMobile ? "yes" : "no"}</span></p>
      </div>

      <div className="border-t border-slate-800 pt-2 space-y-1">
        <p className="text-slate-500">Nearby:</p>
        {nearby ? (
          <>
            <p className="text-amber-400">{nearby.object.name}</p>
            <p className="text-slate-600">type: {nearby.object.type}</p>
            <p className="text-slate-600">action: {nearby.action}</p>
            <p className="text-slate-600">dist: {nearby.distance.toFixed(2)}m</p>
            <p className="text-slate-600">evidenceId: {nearby.evidenceId ?? "-"}</p>
            <p className="text-slate-600">npcId: {nearby.npcId ?? "-"}</p>
          </>
        ) : (
          <p className="text-slate-600">none in range</p>
        )}
      </div>
    </div>
  );
}
