// src/components/game/MobileInvestigationScreen.tsx
// 手机端：2D Tab 调查界面（保留原流程）
import { useState } from "react";
import { AppShell } from "../layout/AppShell";
import { ScenePanel } from "./ScenePanel";
import { EvidencePanel } from "./EvidencePanel";
import { NpcPanel } from "./NpcPanel";
import { TestimonyBoard } from "./TestimonyBoard";
import { RewindPanel } from "./RewindPanel";
import { TutorialOverlay } from "./TutorialOverlay";

interface MobileInvestigationScreenProps {
  onAccuse: () => void;
}

export function MobileInvestigationScreen({ onAccuse }: MobileInvestigationScreenProps) {
  const [activeTab, setActiveTab] = useState("scene");

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
    <AppShell showNav activeTab={activeTab} onTabChange={setActiveTab}>
      <TutorialOverlay />
      {renderTab()}
    </AppShell>
  );
}
