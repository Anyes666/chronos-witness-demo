import { useEffect, useState } from "react";
import type { InteractionTarget } from "../../engine/interactionEngine";
import { interactionState } from "./ThreeGameRoot";

const EVIDENCE_LABELS: Record<string, string> = {
  E1_WALL_SCRATCHES: "七道划痕",
  E2_MEMORY_READER: "损坏的记忆读取器",
  E3_LIGHT_LOG: "电箱日志",
  E4_TEMPERATURE_LOG: "温控面板",
  E5_SHEN_NOTE: "沈鹤鸣笔记",
  E6_EXECUTION_ORDER: "执行令碎片",
};

const NPC_LABELS: Record<string, string> = {
  lin_xu: "林叙",
  lao_he: "老何",
  doctor_lu: "陆医生",
};

function getPromptText(target: InteractionTarget): string {
  if (target.action === "discover_evidence") {
    return `调查：${target.evidenceId ? EVIDENCE_LABELS[target.evidenceId] ?? "物证" : "物证"}`;
  }
  if (target.action === "ask_npc") {
    return `询问：${target.npcId ? NPC_LABELS[target.npcId] ?? "证人" : "证人"}`;
  }
  if (target.action === "open_board") {
    return "打开：通讯终端";
  }
  return target.label;
}

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
    <div className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 pointer-events-none">
      <div className="min-w-64 rounded-lg border border-cyan-500/45 bg-slate-950/88 px-5 py-3 text-center shadow-xl shadow-cyan-950/35 backdrop-blur">
        <p className="text-sm font-medium text-slate-100">{getPromptText(target)}</p>
        <p className="mt-2 flex items-center justify-center gap-2 text-xs text-slate-400">
          <span className="rounded border border-amber-400/60 bg-amber-400/10 px-2 py-0.5 font-mono text-amber-300">
            E
          </span>
          交互
        </p>
      </div>
    </div>
  );
}
