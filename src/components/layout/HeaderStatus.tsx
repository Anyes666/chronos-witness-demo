// src/components/layout/HeaderStatus.tsx
import { useGameStore } from "../../engine/gameStore";
import { getEntropyLabel } from "../../engine/driftEngine";
import { Badge } from "../ui/Badge";

export function HeaderStatus() {
  const currentRound = useGameStore((s) => s.currentRound);
  const entropy = useGameStore((s) => s.entropy);
  const getRemainingRewinds = useGameStore((s) => s.getRemainingRewinds);
  const label = getEntropyLabel(entropy);
  const remaining = getRemainingRewinds();

  const labelVariant =
    label === "stable" ? "success" : label === "unstable" ? "warning" : "danger";

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-slate-900/90 border-b border-slate-800 text-sm">
      <div className="flex items-center gap-3">
        <span className="text-slate-400">时序证人</span>
        <Badge variant="info">第 {currentRound} 轮回溯</Badge>
      </div>
      <div className="flex items-center gap-3">
        <Badge variant={labelVariant as "success" | "warning" | "danger"}>
          熵值 {entropy} · {label === "stable" ? "稳定" : label === "unstable" ? "不稳定" : "临界"}
        </Badge>
        <span className="text-slate-500">
          回溯剩余 <span className="text-amber-400 font-mono">{remaining}</span> 次
        </span>
      </div>
    </div>
  );
}
