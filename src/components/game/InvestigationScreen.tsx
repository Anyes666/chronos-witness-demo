// src/components/game/InvestigationScreen.tsx
import { useState } from "react";
import { AppShell } from "../layout/AppShell";
import { ScenePanel } from "./ScenePanel";
import { EvidencePanel } from "./EvidencePanel";
import { NpcPanel } from "./NpcPanel";
import { TestimonyBoard } from "./TestimonyBoard";
import { RewindPanel } from "./RewindPanel";

interface InvestigationScreenProps {
  onAccuse: () => void;
}

export function InvestigationScreen({ onAccuse }: InvestigationScreenProps) {
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
    <AppShell
      showNav
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {renderTab()}
    </AppShell>
  );
}
