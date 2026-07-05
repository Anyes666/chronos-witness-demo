// src/components/game/EndingPanel.tsx
import { useGameStore } from "../../engine/gameStore";
import { DEMO_ENDINGS } from "../../data/cases/demo_shm_001/endings";
import { Button } from "../ui/Button";

interface EndingPanelProps {
  onRestart: () => void;
}

export function EndingPanel({ onRestart }: EndingPanelProps) {
  const accusationResult = useGameStore((s) => s.accusationResult);
  const downloadLog = useGameStore((s) => s.downloadLog);

  const ending = DEMO_ENDINGS.find(
    (e) => e.id === accusationResult?.endingId,
  );

  if (!ending) {
    return (
      <div className="p-6 text-center">
        <p className="text-slate-500">加载结局中…</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-amber-400 mb-2">{ending.title}</h2>
        <p className="text-sm text-slate-500">{ending.description}</p>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
        <div className="text-sm text-slate-400 leading-relaxed whitespace-pre-line">
          {ending.fullText}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Button onClick={downloadLog} className="w-full">
          📥 导出 Playtest 日志
        </Button>
        <Button variant="secondary" onClick={onRestart} className="w-full">
          重新开始
        </Button>
      </div>
    </div>
  );
}
