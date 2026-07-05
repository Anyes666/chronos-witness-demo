// src/components/game/DesktopInvestigationScreen.tsx
// 桌面端：3D 场景 + Overlay 面板的统一调查界面
import { useState, useCallback, useEffect } from "react";
import { useGameStore } from "../../engine/gameStore";
import { feedbackStore } from "../../engine/feedbackStore";
import { HeaderStatus } from "../layout/HeaderStatus";
import { ThreeGameRoot } from "../three/ThreeGameRoot";
import { EvidencePanel } from "./EvidencePanel";
import { NpcPanel } from "./NpcPanel";
import { TestimonyBoard } from "./TestimonyBoard";
import { RewindPanel } from "./RewindPanel";
import { Button } from "../ui/Button";
import { TutorialOverlay } from "./TutorialOverlay";
import { DebugPanel } from "./DebugPanel";
import { controllerEvents } from "../three/ThirdPersonController";
import { setOverlayOpen } from "../three/ThreeGameRoot";

type OverlayPanel = "none" | "npcs" | "evidence" | "board" | "rewind" | "accuse";

interface DesktopInvestigationScreenProps {
  onAccuse: () => void;
}

export function DesktopInvestigationScreen({ onAccuse }: DesktopInvestigationScreenProps) {
  const [panel, setPanel] = useState<OverlayPanel>("none");
  const canRewind = useGameStore((s) => s.canRewind);

  const openPanel = useCallback((p: OverlayPanel, npcId?: string) => {
    setPanel(p);
    setOverlayOpen(true);
    controllerEvents.unlock();
    if (p === "npcs") feedbackStore.info(npcId ? `询问：${npcId}` : "打开证人询问面板");
    if (p === "evidence") feedbackStore.info("打开证据面板");
    if (p === "board") feedbackStore.info("打开证词对照板");
    if (p === "rewind") feedbackStore.info("打开回溯控制面板");
  }, []);

  const closePanel = useCallback(() => {
    setPanel("none");
    setOverlayOpen(false);
    feedbackStore.info("面板已关闭 — 点击画面可恢复 3D 控制");
  }, []);

  // 键盘快捷键
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      // 不处理输入框
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      const key = e.key;

      if (key === "Escape") {
        if (panel !== "none") {
          closePanel();
        } else {
          controllerEvents.unlock();
          feedbackStore.info("已释放视角锁定 — 点击画面重新进入");
        }
      }

      if (key === "Tab") {
        e.preventDefault();
        openPanel(panel === "board" ? "none" : "board");
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [panel, openPanel, closePanel]);

  // 监听 3D E 键交互触发的自定义事件
  useEffect(() => {
    const onOpenNpc = (e: Event) => {
      const npcId = (e as CustomEvent).detail?.npcId;
      openPanel("npcs", npcId);
    };
    const onOpenBoard = () => openPanel("board");

    window.addEventListener("chronos:open_npc", onOpenNpc);
    window.addEventListener("chronos:open_board", onOpenBoard);
    return () => {
      window.removeEventListener("chronos:open_npc", onOpenNpc);
      window.removeEventListener("chronos:open_board", onOpenBoard);
    };
  }, [openPanel]);

  return (
    <div className="relative w-full h-screen bg-slate-950 overflow-hidden">
      {/* 3D 场景背景 */}
      <div className="absolute inset-0 z-0">
        <ThreeGameRoot />
      </div>

      {/* 顶部状态栏 */}
      <div className="absolute top-0 left-0 right-0 z-20 pointer-events-auto">
        <HeaderStatus />
      </div>

      {/* 新手引导 */}
      <TutorialOverlay />
      <DebugPanel />

      {/* 操作提示（左下角） */}
      <div className="absolute bottom-6 left-4 z-20 text-xs text-slate-500 space-y-1 pointer-events-none select-none">
        <p><span className="text-amber-500 font-mono">WASD</span> 移动</p>
        <p><span className="text-amber-500 font-mono">鼠标</span> 转向 · 点击画面锁定</p>
        <p><span className="text-amber-500 font-mono">E</span> 交互</p>
        <p><span className="text-amber-500 font-mono">Tab</span> 证词对照板</p>
        <p><span className="text-amber-500 font-mono">R</span> 回溯</p>
        <p><span className="text-amber-500 font-mono">Esc</span> 关闭面板 / 释放视角</p>
      </div>

      {/* 右下角：快速操作按钮 */}
      <div className="absolute bottom-6 right-4 z-20 flex flex-col gap-2 pointer-events-auto">
        <Button size="sm" variant="secondary" onClick={() => openPanel("npcs")}>
          👤 证人
        </Button>
        <Button size="sm" variant="secondary" onClick={() => openPanel("evidence")}>
          🔍 证据
        </Button>
        <Button size="sm" variant={panel === "board" ? "primary" : "secondary"} onClick={() => openPanel("board")}>
          📋 对照板
        </Button>
        {canRewind() ? (
          <Button size="sm" variant="primary" onClick={() => openPanel("rewind")}>
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
        <div className="absolute top-12 right-0 bottom-0 w-96 max-w-[90vw] bg-slate-900/95 border-l border-slate-700/50 z-40 overflow-y-auto shadow-2xl pointer-events-auto">
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
    </div>
  );
}
