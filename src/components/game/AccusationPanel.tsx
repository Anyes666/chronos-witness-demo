// src/components/game/AccusationPanel.tsx
import { useState } from "react";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { useGameStore } from "../../engine/gameStore";
import { ACCUSATION_WHO, ACCUSATION_VERSION } from "../../data/cases/demo_shm_001/endings";
import { evaluateEvidenceCoverage } from "../../engine/accusationEngine";
import { feedbackStore } from "../../engine/feedbackStore";

interface AccusationPanelProps {
  onComplete: () => void;
}

export function AccusationPanel({ onComplete }: AccusationPanelProps) {
  const submitAccusation = useGameStore((s) => s.submitAccusation);
  const getRawState = useGameStore((s) => s.getRawState);
  const [step, setStep] = useState<1 | 2>(1);
  const [who, setWho] = useState("");
  const [version, setVersion] = useState("");

  const coverage = evaluateEvidenceCoverage(getRawState());

  const handleSubmit = () => {
    if (!who) { feedbackStore.warning("请先选择谁造成了死亡"); return; }
    if (!version) { feedbackStore.warning("请选择要固定的真相版本"); return; }
    submitAccusation({ whoCausedDeath: who, whichVersionToFix: version });
    feedbackStore.success("指控已提交");
    onComplete();
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-amber-400 mb-2">最终指控</h2>
        <p className="text-sm text-slate-500">
          证据覆盖等级：
          <span
            className={
              coverage === "high"
                ? "text-emerald-400"
                : coverage === "medium"
                  ? "text-amber-400"
                  : "text-red-400"
            }
          >
            {coverage === "high" ? "高" : coverage === "medium" ? "中" : "低"}
          </span>
        </p>
      </div>

      {step === 1 && (
        <div className="space-y-3">
          <p className="text-slate-300 font-medium">第一步：你认为谁造成了沈鹤鸣的死亡？</p>
          {ACCUSATION_WHO.map((opt) => (
            <Card
              key={opt.id}
              highlighted={who === opt.id}
              onClick={() => { setWho(opt.id); setStep(2); }}
            >
              <p className="font-medium text-slate-200">{opt.label}</p>
              <p className="text-xs text-slate-500 mt-1">{opt.description}</p>
            </Card>
          ))}
        </div>
      )}

      {step === 2 && (
        <div className="space-y-3">
          <p className="text-slate-300 font-medium">
            第二步：你愿意把哪个版本固定为真相？
          </p>
          <p className="text-xs text-slate-600">
            你指控「{ACCUSATION_WHO.find((o) => o.id === who)?.label}」造成了死亡
          </p>
          {ACCUSATION_VERSION.map((opt) => (
            <Card
              key={opt.id}
              highlighted={version === opt.id}
              onClick={() => setVersion(opt.id)}
            >
              <p className="font-medium text-slate-200">{opt.label}</p>
              <p className="text-xs text-slate-500 mt-1">{opt.description}</p>
            </Card>
          ))}
          <Button
            className="w-full mt-4"
            disabled={!version}
            onClick={handleSubmit}
          >
            提交指控
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full"
            onClick={() => setStep(1)}
          >
            ← 重新选择
          </Button>
        </div>
      )}
    </div>
  );
}
