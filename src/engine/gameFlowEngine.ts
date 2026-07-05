import type { EvidenceId, GameSaveData, TestimonyRecord } from "./types";

export type GamePhase =
  | "start"
  | "briefing"
  | "investigation"
  | "accusation"
  | "ending";

export interface GameFlowState {
  currentRound: number;
  discoveredEvidenceIds: EvidenceId[];
  testimonyHistory: TestimonyRecord[];
  endingId?: string;
}

function canEnterAccusation(state: GameFlowState): boolean {
  return (
    state.currentRound >= 3 ||
    state.discoveredEvidenceIds.length >= 3 ||
    state.testimonyHistory.length >= 3
  );
}

export function canTransition(
  from: GamePhase,
  to: GamePhase,
  state: GameFlowState | GameSaveData,
): boolean {
  if (from === "start" && to === "briefing") return true;
  if (from === "briefing" && to === "investigation") return true;
  if (from === "investigation" && to === "accusation") {
    return canEnterAccusation(state);
  }
  if (from === "accusation" && to === "ending") return true;
  if (from === "ending" && to === "start") return true;
  return false;
}

export function getNextAllowedPhases(
  phase: GamePhase,
  state: GameFlowState | GameSaveData,
): GamePhase[] {
  const phases: GamePhase[] = ["start", "briefing", "investigation", "accusation", "ending"];
  return phases.filter((to) => canTransition(phase, to, state));
}

export function getDefaultPhaseAfterNewGame(): GamePhase {
  return "briefing";
}
