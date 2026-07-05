import type { GameSaveData } from "../../engine/types";
import {
  getCurrentObjective,
  getObjectiveDisplayMeta,
  getObjectiveProgress,
  type Objective,
} from "../../engine/objectiveEngine";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { HintButton } from "./HintButton";

interface ObjectivePanelProps {
  state: GameSaveData;
  mode: "desktop" | "mobile";
  onAction: (objective: Objective) => void;
}

export function ObjectivePanel({ state, mode, onAction }: ObjectivePanelProps) {
  const objective = getCurrentObjective(state);
  const progress = getObjectiveProgress(state);
  const meta = getObjectiveDisplayMeta(objective.category);
  const isMobile = mode === "mobile";

  return (
    <section
      className={
        isMobile
          ? "mx-3 mt-3 rounded-lg border border-cyan-700/40 bg-slate-950/95 p-3 shadow-lg shadow-cyan-950/20"
          : "w-80 rounded-lg border border-cyan-700/40 bg-slate-950/80 p-4 shadow-xl shadow-cyan-950/20 backdrop-blur"
      }
      aria-label="当前目标"
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Badge variant={meta.badgeVariant}>{meta.label}</Badge>
          <span className="text-xs text-slate-500">目标 {progress.percent}%</span>
        </div>
        <span className="text-xs text-slate-600">
          {progress.completed}/{progress.total}
        </span>
      </div>

      <h2 className={isMobile ? "text-sm font-semibold text-slate-100" : "text-base font-semibold text-slate-100"}>
        {objective.title}
      </h2>
      <p className="mt-1 text-xs leading-relaxed text-slate-400">
        {objective.description}
      </p>

      <div className={isMobile ? "mt-3 grid grid-cols-2 gap-2" : "mt-4 flex gap-2"}>
        <Button
          type="button"
          size="sm"
          className="min-h-11 flex-1 bg-amber-600 hover:bg-amber-500"
          onClick={() => onAction(objective)}
        >
          {objective.actionLabel}
        </Button>
        <HintButton
          state={state}
          objective={objective}
          className={isMobile ? "w-full" : "flex-1"}
        />
      </div>
    </section>
  );
}
