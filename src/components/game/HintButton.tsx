import { useEffect, useState } from "react";
import type { GameSaveData } from "../../engine/types";
import type { Objective } from "../../engine/objectiveEngine";
import { getNextHint } from "../../engine/hintEngine";
import { feedbackStore } from "../../engine/feedbackStore";
import { Button } from "../ui/Button";

interface HintButtonProps {
  state: GameSaveData;
  objective: Objective;
  className?: string;
}

export function HintButton({ state, objective, className = "" }: HintButtonProps) {
  const [usedHintCount, setUsedHintCount] = useState(0);

  useEffect(() => {
    setUsedHintCount(0);
  }, [objective.id]);

  const showHint = () => {
    const hint = getNextHint(state, objective, usedHintCount);
    feedbackStore.info(`提示 ${hint.level}/3：${hint.text}`);
    setUsedHintCount((count) => Math.min(count + 1, 3));
  };

  const nextLevel = Math.min(usedHintCount + 1, 3);

  return (
    <Button
      type="button"
      size="sm"
      variant="secondary"
      className={`min-h-11 border-cyan-700/60 bg-slate-900/80 text-cyan-100 hover:bg-slate-800 ${className}`}
      onClick={showHint}
    >
      提示 {nextLevel}/3
    </Button>
  );
}
