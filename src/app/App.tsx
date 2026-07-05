// src/app/App.tsx
import { useState } from "react";
import { useGameStore } from "../engine/gameStore";
import { StartScreen } from "../components/game/StartScreen";
import { BriefingScreen } from "../components/game/BriefingScreen";
import { InvestigationScreen } from "../components/game/InvestigationScreen";
import { AccusationPanel } from "../components/game/AccusationPanel";
import { EndingPanel } from "../components/game/EndingPanel";

type Page = "start" | "briefing" | "investigation" | "accusation" | "ending";

export default function App() {
  const [page, setPage] = useState<Page>("start");
  const newGame = useGameStore((s) => s.newGame);
  const endingId = useGameStore((s) => s.endingId);

  const handleStart = () => {
    newGame();
    setPage("briefing");
  };

  const handleBriefingContinue = () => {
    setPage("investigation");
  };

  const handleAccuse = () => {
    if (endingId) {
      setPage("ending");
    } else {
      setPage("accusation");
    }
  };

  const handleAccuseComplete = () => {
    setPage("ending");
  };

  const handleRestart = () => {
    newGame();
    setPage("start");
  };

  switch (page) {
    case "start":
      return <StartScreen onStart={handleStart} />;
    case "briefing":
      return <BriefingScreen onContinue={handleBriefingContinue} />;
    case "investigation":
      return <InvestigationScreen onAccuse={handleAccuse} />;
    case "accusation":
      return <AccusationPanel onComplete={handleAccuseComplete} />;
    case "ending":
      return <EndingPanel onRestart={handleRestart} />;
    default:
      return <StartScreen onStart={handleStart} />;
  }
}
