import { useEffect, useState } from "react";
import { useGameStore } from "../../engine/gameStore";
import { DEMO_NPCS } from "../../data/cases/demo_shm_001/witnesses";
import type { GameSaveData, NpcId, TestimonyRecord } from "../../engine/types";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

export const BOARD_GUIDE_STORAGE_KEY = "chronos_testimony_board_guide_seen";

export const TESTIMONY_BOARD_LEGEND = [
  {
    label: "稳定锚点",
    colorClass: "text-emerald-400",
    description: "多轮都出现的信息，更值得相信。",
  },
  {
    label: "变化词",
    colorClass: "text-amber-400",
    description: "前后矛盾，可能是记忆漂移或隐瞒。",
  },
  {
    label: "新增词",
    colorClass: "text-blue-300",
    description: "本轮才出现的新线索。",
  },
  {
    label: "消失词",
    colorClass: "text-red-300",
    description: "之前出现过，本轮被省略的信息。",
  },
];

export const TESTIMONY_BOARD_GUIDE_STEPS = [
  "第一步：看绿色稳定锚点。",
  "第二步：看黄色变化词。",
  "第三步：把稳定信息和物证交叉验证。",
  "第四步：不要急着指控。",
];

export type TestimonyBoardStatus = "empty" | "insufficient" | "ready";

export function getTestimonyBoardStatus(testimonyHistory: TestimonyRecord[]): TestimonyBoardStatus {
  if (testimonyHistory.length === 0) return "empty";
  const roundCount = new Set(testimonyHistory.map((record) => record.round)).size;
  return roundCount < 2 ? "insufficient" : "ready";
}

export function getTestimonyReasoningHints(state: GameSaveData): string[] {
  const hints: string[] = [];

  if (state.discoveredEvidenceIds.includes("E2_MEMORY_READER")) {
    hints.push("记忆读取器的损坏痕迹让官方结论变得不稳定。");
  }
  if (state.discoveredEvidenceIds.includes("E3_LIGHT_LOG")) {
    hints.push("23:17 的灯光中断记录值得和证词时间点比对。");
  }
  if (state.currentRound >= 1 && getTestimonyBoardStatus(state.testimonyHistory) === "ready") {
    hints.push("现在开始关注每轮都没有变化的信息。");
  }

  const linXuRounds = new Set(
    state.testimonyHistory
      .filter((record) => record.npcId === "lin_xu")
      .map((record) => record.round),
  );
  if (linXuRounds.size >= 2) {
    hints.push("注意林叙对到场和程序的描述是否前后一致。");
  }

  return hints;
}

interface TestimonyBoardProps {
  onNavigate?: (target: "npcs" | "rewind") => void;
}

export function TestimonyBoard({ onNavigate }: TestimonyBoardProps) {
  const getTestimonyBoard = useGameStore((s) => s.getTestimonyBoard);
  const getStableFactCoverage = useGameStore((s) => s.getStableFactCoverage);
  const rawState = useGameStore((s) => s.getRawState());
  const [selectedNpc, setSelectedNpc] = useState<NpcId | null>(null);
  const [showGuide, setShowGuide] = useState(false);

  const board = getTestimonyBoard();
  const coverage = getStableFactCoverage();
  const status = getTestimonyBoardStatus(rawState.testimonyHistory);
  const npcFiltered = selectedNpc ? board.filter((row) => row.npcId === selectedNpc) : board;
  const reasoningHints = getTestimonyReasoningHints(rawState);

  useEffect(() => {
    const seen = localStorage.getItem(BOARD_GUIDE_STORAGE_KEY);
    if (!seen) setShowGuide(true);
  }, []);

  const dismissGuide = () => {
    localStorage.setItem(BOARD_GUIDE_STORAGE_KEY, "1");
    setShowGuide(false);
  };

  const renderHeader = () => (
    <>
      <div>
        <h3 className="text-lg font-semibold text-slate-200">证词对照板</h3>
        <p className="mt-1 text-sm leading-relaxed text-slate-400">
          不要只相信某一句证词。回溯后，观察哪些词变了、哪些信息没有变。稳定的信息才可能成为推理锚点。
        </p>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {TESTIMONY_BOARD_LEGEND.map((item) => (
          <div key={item.label} className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
            <p className={`text-sm font-medium ${item.colorClass}`}>{item.label}</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">{item.description}</p>
          </div>
        ))}
      </div>
    </>
  );

  const renderGuide = () => showGuide && (
    <div className="rounded-lg border border-cyan-700/50 bg-cyan-950/30 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-cyan-200">第一次使用对照板</p>
          <ul className="mt-2 space-y-1 text-xs leading-relaxed text-cyan-100/80">
            {TESTIMONY_BOARD_GUIDE_STEPS.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ul>
        </div>
        <Button type="button" size="sm" variant="secondary" className="min-h-11 shrink-0" onClick={dismissGuide}>
          知道了
        </Button>
      </div>
    </div>
  );

  if (status === "empty") {
    return (
      <div className="space-y-4 p-4">
        {renderHeader()}
        {renderGuide()}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 text-center">
          <h4 className="text-base font-semibold text-slate-200">还没有可比对的证词</h4>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            先去询问至少一名证人。回溯后再次询问，再回到这里比较变化。
          </p>
          <Button type="button" className="mt-4 min-h-11" onClick={() => onNavigate?.("npcs")}>
            去询问证人
          </Button>
        </div>
      </div>
    );
  }

  if (status === "insufficient") {
    return (
      <div className="space-y-4 p-4">
        {renderHeader()}
        {renderGuide()}
        <div className="rounded-xl border border-amber-800/50 bg-amber-950/20 p-6 text-center">
          <h4 className="text-base font-semibold text-amber-200">还缺少第二轮证词</h4>
          <p className="mt-2 text-sm leading-relaxed text-amber-100/70">
            你已经记录了证词，但还没有形成漂移对照。进行一次回溯，再询问同一名证人，变化才会显现。
          </p>
          <Button type="button" className="mt-4 min-h-11" onClick={() => onNavigate?.("rewind")}>
            去回溯
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      {renderHeader()}
      {renderGuide()}

      {reasoningHints.length > 0 && (
        <div className="rounded-lg border border-amber-800/40 bg-amber-950/20 p-4">
          <p className="text-sm font-semibold text-amber-300">当前可推理提示</p>
          <ul className="mt-2 space-y-1 text-xs leading-relaxed text-amber-100/75">
            {reasoningHints.map((hint) => (
              <li key={hint}>{hint}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant={!selectedNpc ? "primary" : "ghost"}
          className="min-h-11"
          onClick={() => setSelectedNpc(null)}
        >
          全部
        </Button>
        {DEMO_NPCS.map((npc) => (
          <Button
            key={npc.id}
            size="sm"
            variant={selectedNpc === npc.id ? "primary" : "ghost"}
            className="min-h-11"
            onClick={() => setSelectedNpc(npc.id)}
          >
            {npc.name}
          </Button>
        ))}
      </div>

      {coverage.length > 0 && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="mb-2 text-sm font-medium text-emerald-300">稳定事实覆盖</p>
          {coverage.map((item) => (
            <div key={item.stableFactId} className="mb-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <Badge variant="success">{item.stableFactId}</Badge>
              <span>出现 {item.roundCount} 轮 / 轮次 {item.rounds.join(", ")}</span>
            </div>
          ))}
        </div>
      )}

      <div className="overflow-x-auto">
        <div className="min-w-[320px] space-y-3">
          {npcFiltered.map((row, index) => (
            <div
              key={`${row.shellId}-${index}`}
              className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-4"
            >
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-slate-200">{row.npcName}</span>
                <Badge variant="info">第 {row.round} 轮</Badge>
                <Badge variant="warning">漂移 {row.driftLevel}</Badge>
                <span className="text-xs text-slate-600">{row.emotion}</span>
              </div>

              <p className="mb-2 text-sm leading-relaxed text-slate-400">{row.summary}</p>

              {row.stableFactIds.length > 0 && (
                <div className="mb-2 flex flex-wrap gap-1">
                  <span className="text-xs text-emerald-400">稳定：</span>
                  {row.stableFactIds.map((factId) => (
                    <Badge key={factId} variant="success">{factId}</Badge>
                  ))}
                </div>
              )}

              <div className="grid gap-2 text-xs sm:grid-cols-3">
                {row.changedTokens.length > 0 && (
                  <div>
                    <span className="text-amber-400">变化：</span>
                    {row.changedTokens.map((token) => (
                      <span key={token} className="ml-1 text-amber-300">{token}</span>
                    ))}
                  </div>
                )}
                {row.newTokens.length > 0 && (
                  <div>
                    <span className="text-blue-300">新增：</span>
                    {row.newTokens.map((token) => (
                      <span key={token} className="ml-1 text-blue-200">{token}</span>
                    ))}
                  </div>
                )}
                {row.omittedTokens.length > 0 && (
                  <div>
                    <span className="text-red-300">消失：</span>
                    {row.omittedTokens.map((token) => (
                      <span key={token} className="ml-1 text-red-200">{token}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
