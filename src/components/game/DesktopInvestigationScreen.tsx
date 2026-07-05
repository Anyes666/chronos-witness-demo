import { useCallback, useEffect, useState } from "react";
import { useGameStore } from "../../engine/gameStore";
import { feedbackStore } from "../../engine/feedbackStore";
import type { Objective } from "../../engine/objectiveEngine";
import { HeaderStatus } from "../layout/HeaderStatus";
import { ThreeGameRoot } from "../three/ThreeGameRoot";
import { controllerEvents } from "../three/ThirdPersonController";
import { setOverlayOpen } from "../three/ThreeGameRoot";
import { Button } from "../ui/Button";
import { DebugPanel } from "./DebugPanel";
import { EvidencePanel } from "./EvidencePanel";
import { NpcPanel } from "./NpcPanel";
import { ObjectivePanel } from "./ObjectivePanel";
import { RewindPanel } from "./RewindPanel";
import { ScenePanel } from "./ScenePanel";
import { TestimonyBoard } from "./TestimonyBoard";
import { TutorialOverlay } from "./TutorialOverlay";

type OverlayPanel = "none" | "scene" | "npcs" | "evidence" | "board" | "rewind";

interface DesktopInvestigationScreenProps {
  onAccuse: () => void;
}

const PANEL_TITLES: Record<Exclude<OverlayPanel, "none">, string> = {
  scene: "现场调查",
  npcs: "证人询问",
  evidence: "已发现物证",
  board: "证词对照板",
  rewind: "回溯控制",
};

export function DesktopInvestigationScreen({ onAccuse }: DesktopInvestigationScreenProps) {
  const [panel, setPanel] = useState<OverlayPanel>("none");
  const canRewind = useGameStore((s) => s.canRewind);
  const rawState = useGameStore((s) => s.getRawState());

  const closePanel = useCallback(() => {
    setPanel("none");
    setOverlayOpen(false);
    feedbackStore.info("面板已关闭，点击画面可恢复 3D 控制");
  }, []);

  const openPanel = useCallback((nextPanel: Exclude<OverlayPanel, "none">, npcId?: string) => {
    setPanel(nextPanel);
    setOverlayOpen(true);
    controllerEvents.unlock();

    if (nextPanel === "npcs") feedbackStore.info(npcId ? `询问：${npcId}` : "打开证人询问面板");
    if (nextPanel === "evidence") feedbackStore.info("打开证据面板");
    if (nextPanel === "board") feedbackStore.info("打开证词对照板");
    if (nextPanel === "rewind") feedbackStore.info("打开回溯控制面板");
    if (nextPanel === "scene") feedbackStore.info("打开现场调查面板");
  }, []);

  const handleObjectiveAction = useCallback((objective: Objective) => {
    if (objective.targetPanel === "accusation") {
      onAccuse();
      return;
    }

    const targetPanel = objective.targetPanel ?? "scene";
    openPanel(targetPanel);
  }, [onAccuse, openPanel]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === "Escape") {
        if (panel !== "none") {
          closePanel();
        } else {
          controllerEvents.unlock();
          feedbackStore.info("已释放视角锁定，点击画面重新进入");
        }
      }

      if (e.key === "Tab") {
        e.preventDefault();
        if (panel === "board") {
          closePanel();
        } else {
          openPanel("board");
        }
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [panel, openPanel, closePanel]);

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
    <div className="relative h-screen w-full overflow-hidden bg-slate-950">
      <div className="absolute inset-0 z-0">
        <ThreeGameRoot />
      </div>

      <div className="absolute left-0 right-0 top-0 z-20 pointer-events-auto">
        <HeaderStatus />
      </div>

      <div className="absolute left-4 top-14 z-20 pointer-events-auto">
        <ObjectivePanel
          state={rawState}
          mode="desktop"
          onAction={handleObjectiveAction}
        />
      </div>

      <TutorialOverlay />
      <DebugPanel />

      <div className="absolute bottom-6 left-4 z-20 select-none space-y-1 text-xs text-slate-500 pointer-events-none">
        <p><span className="font-mono text-amber-500">WASD</span> 移动</p>
        <p><span className="font-mono text-amber-500">鼠标</span> 转向 / 点击画面锁定</p>
        <p><span className="font-mono text-amber-500">E</span> 交互</p>
        <p><span className="font-mono text-amber-500">Tab</span> 证词对照板</p>
        <p><span className="font-mono text-amber-500">R</span> 回溯</p>
        <p><span className="font-mono text-amber-500">Esc</span> 关闭面板 / 释放视角</p>
      </div>

      <div className="absolute bottom-6 right-4 z-20 flex flex-col gap-2 pointer-events-auto">
        <Button size="sm" variant="secondary" onClick={() => openPanel("npcs")}>
          证人
        </Button>
        <Button size="sm" variant="secondary" onClick={() => openPanel("evidence")}>
          证据
        </Button>
        <Button size="sm" variant={panel === "board" ? "primary" : "secondary"} onClick={() => openPanel("board")}>
          对照板
        </Button>
        {canRewind() ? (
          <Button size="sm" variant="primary" onClick={() => openPanel("rewind")}>
            回溯
          </Button>
        ) : (
          <Button size="sm" variant="danger" onClick={onAccuse}>
            指控
          </Button>
        )}
      </div>

      {panel !== "none" && (
        <div className="absolute bottom-0 right-0 top-12 z-40 w-96 max-w-[90vw] overflow-y-auto border-l border-slate-700/50 bg-slate-900/95 shadow-2xl pointer-events-auto">
          <div className="sticky top-0 flex items-center justify-between border-b border-slate-800 bg-slate-900/95 px-4 py-3">
            <span className="text-sm font-medium text-slate-300">
              {PANEL_TITLES[panel]}
            </span>
            <Button variant="ghost" size="sm" onClick={closePanel}>
              关闭
            </Button>
          </div>
          <div className="p-2">
            {panel === "scene" && <ScenePanel />}
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
