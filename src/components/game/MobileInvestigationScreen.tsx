import { useCallback, useState } from "react";
import type { Objective } from "../../engine/objectiveEngine";
import { AppShell } from "../layout/AppShell";
import { EvidencePanel } from "./EvidencePanel";
import { NpcPanel } from "./NpcPanel";
import { ObjectivePanel } from "./ObjectivePanel";
import { RewindPanel } from "./RewindPanel";
import { ScenePanel } from "./ScenePanel";
import { TestimonyBoard } from "./TestimonyBoard";
import { TutorialOverlay } from "./TutorialOverlay";
import { useGameSaveData } from "./useGameSaveData";

interface MobileInvestigationScreenProps {
  onAccuse: () => void;
}

type MobileTab = "scene" | "npcs" | "evidence" | "board" | "rewind";

function targetPanelToTab(targetPanel: Objective["targetPanel"]): MobileTab {
  if (targetPanel === "npcs") return "npcs";
  if (targetPanel === "evidence") return "evidence";
  if (targetPanel === "board") return "board";
  if (targetPanel === "rewind") return "rewind";
  return "scene";
}

export function MobileInvestigationScreen({ onAccuse }: MobileInvestigationScreenProps) {
  const [activeTab, setActiveTab] = useState<MobileTab>("scene");
  const [tutorialReopenSignal, setTutorialReopenSignal] = useState(0);
  const rawState = useGameSaveData();

  const handleObjectiveAction = useCallback((objective: Objective) => {
    if (objective.targetPanel === "accusation") {
      onAccuse();
      return;
    }

    setActiveTab(targetPanelToTab(objective.targetPanel));
  }, [onAccuse]);

  const renderTab = () => {
    switch (activeTab) {
      case "scene":
        return <ScenePanel />;
      case "npcs":
        return <NpcPanel />;
      case "evidence":
        return <EvidencePanel />;
      case "board":
        return <TestimonyBoard onNavigate={(target) => setActiveTab(target)} />;
      case "rewind":
        return <RewindPanel onAccuse={onAccuse} />;
      default:
        return <ScenePanel />;
    }
  };

  return (
    <AppShell showNav activeTab={activeTab} onTabChange={(tabId) => setActiveTab(tabId as MobileTab)}>
      <TutorialOverlay reopenSignal={tutorialReopenSignal} />
      <ObjectivePanel
        state={rawState}
        mode="mobile"
        onAction={handleObjectiveAction}
      />
      <div className="mx-3 mt-2 flex justify-end">
        <button
          type="button"
          className="min-h-11 rounded-md border border-slate-700 bg-slate-900 px-3 text-sm text-slate-300"
          onClick={() => setTutorialReopenSignal((signal) => signal + 1)}
        >
          重新打开引导
        </button>
      </div>
      {renderTab()}
    </AppShell>
  );
}
