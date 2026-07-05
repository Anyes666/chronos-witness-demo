// src/app/App.tsx
import { useState } from "react";
import { useGameStore } from "../engine/gameStore";
import { StartScreen } from "../components/game/StartScreen";
import { BriefingScreen } from "../components/game/BriefingScreen";
import { InvestigationScreen } from "../components/game/InvestigationScreen";
import { AccusationPanel } from "../components/game/AccusationPanel";
import { EndingPanel } from "../components/game/EndingPanel";
import { ToastContainer } from "../components/ui/Toast";

type Page = "start" | "briefing" | "investigation" | "accusation" | "ending";

function PageRenderer({ page, onPage }: { page: Page; onPage: (p: Page) => void }) {
  const newGame = useGameStore((s) => s.newGame);
  const endingId = useGameStore((s) => s.endingId);

  switch (page) {
    case "start":
      return <StartScreen onStart={() => { newGame(); onPage("briefing"); }} />;
    case "briefing":
      return <BriefingScreen onContinue={() => onPage("investigation")} />;
    case "investigation":
      return <InvestigationScreen onAccuse={() => onPage(endingId ? "ending" : "accusation")} />;
    case "accusation":
      return <AccusationPanel onComplete={() => onPage("ending")} />;
    case "ending":
      return <EndingPanel onRestart={() => { newGame(); onPage("start"); }} />;
    default:
      return <StartScreen onStart={() => { newGame(); onPage("briefing"); }} />;
  }
}

export default function App() {
  const [page, setPage] = useState<Page>("start");

  return (
    <>
      <PageRenderer page={page} onPage={setPage} />
      <ToastContainer />
    </>
  );
}
