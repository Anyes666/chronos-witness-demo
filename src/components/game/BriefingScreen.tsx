// src/components/game/BriefingScreen.tsx
import { Button } from "../ui/Button";
import { DEMO_CASE_META } from "../../data/cases/demo_shm_001";

interface BriefingScreenProps {
  onContinue: () => void;
}

export function BriefingScreen({ onContinue }: BriefingScreenProps) {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12 space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-amber-400 mb-1">
          {DEMO_CASE_META.title}
        </h2>
        <p className="text-slate-500 text-sm">{DEMO_CASE_META.subtitle}</p>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-4 text-slate-400 leading-relaxed text-sm">
        {DEMO_CASE_META.briefing.split("\n\n").map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>

      <div className="flex justify-between items-center text-xs text-slate-600">
        <span>回溯额度：{DEMO_CASE_META.maxRewinds} 次</span>
        <span>NPC：林叙 · 老何 · 陆医生</span>
      </div>

      <div className="flex justify-center">
        <Button size="lg" onClick={onContinue}>
          进入档案馆
        </Button>
      </div>
    </div>
  );
}
