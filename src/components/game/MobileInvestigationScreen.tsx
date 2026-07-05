import { useCallback, useState } from "react";
import { useGameStore } from "../../engine/gameStore";
import type { Objective } from "../../engine/objectiveEngine";
import { AppShell } from "../layout/AppShell";
import { EvidencePanel } from "./EvidencePanel";
import { NpcPanel } from "./NpcPanel";
import { ObjectivePanel } from "./ObjectivePanel";
import { RewindPanel } from "./RewindPanel";
import { ScenePanel } from "./ScenePanel";
import { TestimonyBoard } from "./TestimonyBoard";
import { TutorialOverlay } from "./TutorialOverlay";

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
  const rawState = useGameStore((s) => s.getRawState());

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
        return <TestimonyBoard />;
      case "rewind":
        return <RewindPanel onAccuse={onAccuse} />;
      default:
        return <ScenePanel />;
    }
  };

  return (
    <AppShell showNav activeTab={activeTab} onTabChange={(tabId) => setActiveTab(tabId as MobileTab)}>
      <TutorialOverlay />
      <ObjectivePanel
        state={rawState}
        mode="mobile"
        onAction={handleObjectiveAction}
      />
      {renderTab()}
    </AppShell>
  );
}
