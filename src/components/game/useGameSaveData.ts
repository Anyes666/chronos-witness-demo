import { useMemo } from "react";
import { useGameStore } from "../../engine/gameStore";
import type { GameSaveData } from "../../engine/types";

export function useGameSaveData(): GameSaveData {
  const sessionId = useGameStore((s) => s.sessionId);
  const currentRound = useGameStore((s) => s.currentRound);
  const entropy = useGameStore((s) => s.entropy);
  const discoveredEvidenceIds = useGameStore((s) => s.discoveredEvidenceIds);
  const testimonyHistory = useGameStore((s) => s.testimonyHistory);
  const playerMarks = useGameStore((s) => s.playerMarks);
  const actionLogs = useGameStore((s) => s.actionLogs);
  const endingId = useGameStore((s) => s.endingId);

  return useMemo(
    () => ({
      sessionId,
      currentRound: currentRound as GameSaveData["currentRound"],
      entropy,
      discoveredEvidenceIds,
      testimonyHistory,
      playerMarks,
      actionLogs,
      endingId,
      savedAt: "",
    }),
    [
      sessionId,
      currentRound,
      entropy,
      discoveredEvidenceIds,
      testimonyHistory,
      playerMarks,
      actionLogs,
      endingId,
    ],
  );
}
