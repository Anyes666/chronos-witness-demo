// src/components/game/RewindPanel.tsx
import { useGameStore } from "../../engine/gameStore";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { feedbackStore } from "../../engine/feedbackStore";

interface RewindPanelProps {
  onAccuse: () => void;
}

export function RewindPanel({ onAccuse }: RewindPanelProps) {
  const canRewind = useGameStore((s) => s.canRewind);
  const getRemainingRewinds = useGameStore((s) => s.getRemainingRewinds);
  const rewind = useGameStore((s) => s.rewind);
  const currentRound = useGameStore((s) => s.currentRound);
  const entropy = useGameStore((s) => s.entropy);
  const endingId = useGameStore((s) => s.endingId);

  const remaining = getRemainingRewinds();

  return (
    <div className="p-4 space-y-6">
      <h3 className="text-lg font-semibold text-slate-300">⏳ 回溯控制</h3>

      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-slate-400">当前轮回溯</span>
          <Badge variant="info">第 {currentRound} 轮</Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-400">全局熵值</span>
          <span className="font-mono text-amber-400">{entropy}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-400">剩余回溯</span>
          <span className="font-mono text-amber-400">{remaining} 次</span>
        </div>
      </div>

      {canRewind() && (
        <div className="bg-amber-900/20 border border-amber-800/50 rounded-xl p-4">
          <p className="text-sm text-amber-400 mb-3">
            ⚠️ 回溯会扰动时空，证词将发生变化。每次回溯熵值 +15。
          </p>
          <Button variant="primary" onClick={() => { rewind(); feedbackStore.success(`已回溯至第 ${currentRound + 1} 轮 — 证词已变化`); }} className="w-full">
            执行回溯 → 第 {currentRound + 1} 轮
          </Button>
        </div>
      )}

      {!canRewind() && !endingId && (
        <div className="bg-red-900/20 border border-red-800/50 rounded-xl p-4">
          <p className="text-sm text-red-400 mb-3">
            已达回溯上限（3 次）。只有最后一次机会做最终指控。
          </p>
          <Button variant="danger" onClick={onAccuse} className="w-full">
            进入最终指控
          </Button>
        </div>
      )}

      {endingId && (
        <Button variant="primary" onClick={onAccuse} className="w-full">
          查看结局
        </Button>
      )}
    </div>
  );
}
