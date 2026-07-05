import { describe, expect, it } from "vitest";
import {
  BOARD_GUIDE_STORAGE_KEY,
  TESTIMONY_BOARD_GUIDE_STEPS,
  TESTIMONY_BOARD_LEGEND,
  getTestimonyBoardStatus,
  getTestimonyReasoningHints,
} from "../src/components/game/TestimonyBoard";
import type { GameSaveData } from "../src/engine/types";
import { createNewSession } from "../src/engine/sessionEngine";
import { discoverEvidence } from "../src/engine/evidenceEngine";
import { askNpc } from "../src/engine/testimonyEngine";
import { performRewind } from "../src/engine/rewindEngine";

const forbiddenPhrases = [
  "林叙是真凶",
  "真凶是林叙",
  "hiddenTruth",
  "答案是强制回溯",
  "强制第七次完整答案",
];

function makeTwoRoundState(): GameSaveData {
  let state = createNewSession();
  state = askNpc(
    { npcId: "lin_xu", questionId: "q0", questionStyle: "confirm" },
    state,
  ).state;
  state = performRewind(state);
  state = askNpc(
    { npcId: "lin_xu", questionId: "q1", questionStyle: "press" },
    state,
  ).state;
  return state;
}

describe("TestimonyBoard guidance", () => {
  it("uses the stable board guide localStorage key", () => {
    expect(BOARD_GUIDE_STORAGE_KEY).toBe("chronos_testimony_board_guide_seen");
  });

  it("classifies empty and insufficient board states", () => {
    let state = createNewSession();
    expect(getTestimonyBoardStatus(state.testimonyHistory)).toBe("empty");

    state = askNpc(
      { npcId: "lao_he", questionId: "q0", questionStyle: "confirm" },
      state,
    ).state;

    expect(getTestimonyBoardStatus(state.testimonyHistory)).toBe("insufficient");
    expect(getTestimonyBoardStatus(makeTwoRoundState().testimonyHistory)).toBe("ready");
  });

  it("provides legend and first-open guide copy without leaking answers", () => {
    expect(TESTIMONY_BOARD_LEGEND).toHaveLength(4);
    expect(TESTIMONY_BOARD_GUIDE_STEPS).toHaveLength(4);

    const copy = [
      ...TESTIMONY_BOARD_LEGEND.flatMap((item) => [item.label, item.description]),
      ...TESTIMONY_BOARD_GUIDE_STEPS,
    ].join("\n");

    for (const phrase of forbiddenPhrases) {
      expect(copy).not.toContain(phrase);
    }
  });

  it("returns safe reasoning hints from discovered evidence and testimony state", () => {
    let state = createNewSession();
    state = discoverEvidence(state, "E2_MEMORY_READER");
    state = discoverEvidence(state, "E3_LIGHT_LOG");
    state = makeTwoRoundState();

    const hints = getTestimonyReasoningHints({
      ...state,
      discoveredEvidenceIds: ["E2_MEMORY_READER", "E3_LIGHT_LOG"],
    });

    expect(hints.length).toBeGreaterThanOrEqual(3);
    expect(hints.join("\n")).toContain("23:17");
    for (const phrase of forbiddenPhrases) {
      expect(hints.join("\n")).not.toContain(phrase);
    }
  });
});
