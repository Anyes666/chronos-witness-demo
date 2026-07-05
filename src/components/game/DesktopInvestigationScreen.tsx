// src/components/game/DesktopInvestigationScreen.tsx
// 桌面端：3D 场景 + Overlay 面板的统一调查界面
import { useState, useCallback, useRef } from "react";
import { useGameStore } from "../../engine/gameStore";
import { HeaderStatus } from "../layout/HeaderStatus";
import { ThreeGameRoot } from "../three/ThreeGameRoot";
import { EvidencePanel } from "./EvidencePanel";
import { NpcPanel } from "./NpcPanel";
import { TestimonyBoard } from "./TestimonyBoard";
import { RewindPanel } from "./RewindPanel";
import { Button } from "../ui/Button";
import { TutorialOverlay } from "./TutorialOverlay";

type OverlayPanel = "none" | "npcs" | "evidence" | "board" | "rewind" | "accuse";

interface DesktopInvestigationScreenProps {
  onAccuse: () => void;
}

export function DesktopInvestigationScreen({ onAccuse }: DesktopInvestigationScreenProps) {
  const [panel, setPanel] = useState<OverlayPanel>("none");
  const canRewind = useGameStore((s) => s.canRewind);
  const panelRef = useRef<HTMLDivElement>(null);

  const togglePanel = useCallback((p: OverlayPanel) => {
    setPanel((prev) => (prev === p ? "none" : p));
  }, []);

  const closePanel = useCallback(() => setPanel("none"), []);

  return (
    <div className="relative w-full h-screen bg-slate-950 overflow-hidden">
      {/* 3D 场景背景 */}
      <div className="absolute inset-0">
        <ThreeGameRoot />
      </div>

      {/* 顶部状态栏 */}
      <div className="absolute top-0 left-0 right-0 z-20">
        <HeaderStatus />
      </div>

      {/* 操作提示（左下角） */}
      <TutorialOverlay />
      <div className="absolute bottom-6 left-4 z-20 text-xs text-slate-500 space-y-1 pointer-events-none select-none">
        <p><span className="text-amber-500 font-mono">WASD</span> 移动</p>
        <p><span className="text-amber-500 font-mono">鼠标</span> 转向 · 点击画面锁定</p>
        <p><span className="text-amber-500 font-mono">E</span> 交互</p>
        <p><span className="text-amber-500 font-mono">Tab</span> 证词对照板</p>
        <p><span className="text-amber-500 font-mono">R</span> 回溯</p>
        <p><span className="text-amber-500 font-mono">Esc</span> 关闭面板</p>
      </div>

      {/* 右下角：快速操作按钮 */}
      <div className="absolute bottom-6 right-4 z-20 flex flex-col gap-2">
        <Button size="sm" variant="secondary" onClick={() => togglePanel("npcs")}>
          👤 证人
        </Button>
        <Button size="sm" variant="secondary" onClick={() => togglePanel("evidence")}>
          🔍 证据
        </Button>
        <Button size="sm" variant={panel === "board" ? "primary" : "secondary"} onClick={() => togglePanel("board")}>
          📋 对照板
        </Button>
        {canRewind() ? (
          <Button size="sm" variant="primary" onClick={() => togglePanel("rewind")}>
            ⏳ 回溯
          </Button>
        ) : (
          <Button size="sm" variant="danger" onClick={onAccuse}>
            ⚖️ 指控
          </Button>
        )}
      </div>

      {/* Overlay 面板（右侧滑入） */}
      {panel !== "none" && (
        <div
          ref={panelRef}
          className="absolute top-12 right-0 bottom-0 w-96 max-w-[90vw] bg-slate-900/95 border-l border-slate-700/50 z-30 overflow-y-auto shadow-2xl"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 sticky top-0 bg-slate-900/95">
            <span className="text-sm font-medium text-slate-300">
              {panel === "npcs" && "👤 证人询问"}
              {panel === "evidence" && "🔍 已发现物证"}
              {panel === "board" && "📋 证词对照板"}
              {panel === "rewind" && "⏳ 回溯控制"}
            </span>
            <Button variant="ghost" size="sm" onClick={closePanel}>
              ✕ 关闭
            </Button>
          </div>
          <div className="p-2">
            {panel === "npcs" && <NpcPanel />}
            {panel === "evidence" && <EvidencePanel />}
            {panel === "board" && <TestimonyBoard />}
            {panel === "rewind" && <RewindPanel onAccuse={onAccuse} />}
          </div>
        </div>
      )}

      {/* 场景调查面板（底部弹出，调查地点用） */}
      {/* 通过 3D 交互 E 键触发时由 InteractionPrompt 管理 */}
    </div>
  );
}
