import { describe, expect, it } from "vitest";
import {
  getHintForObjective,
  getNextHint,
  getProgressiveHints,
} from "../src/engine/hintEngine";
import { getCurrentObjective } from "../src/engine/objectiveEngine";
import { createNewSession } from "../src/engine/sessionEngine";

const coreObjectiveIds = [
  "investigate_memory_reader",
  "investigate_wall_scratches",
  "interrogate_witness",
  "perform_first_rewind",
  "open_testimony_board",
  "compare_stable_facts",
  "submit_incomplete_accusation",
  "review_ending_export_log",
];

describe("hintEngine", () => {
  it("provides at least three hint levels for every core objective", () => {
    for (const objectiveId of coreObjectiveIds) {
      expect(getHintForObjective(objectiveId, 1).level).toBe(1);
      expect(getHintForObjective(objectiveId, 2).level).toBe(2);
      expect(getHintForObjective(objectiveId, 3).level).toBe(3);
    }
  });

  it("returns the last hint when level is out of range", () => {
    const level3 = getHintForObjective("investigate_memory_reader", 3);
    const level99 = getHintForObjective("investigate_memory_reader", 99 as 3);

    expect(level99).toEqual(level3);
  });

  it("does not leak the final killer or the full truth", () => {
    const forbidden = [
      "林叙就是凶手",
      "凶手是林叙",
      "真凶",
      "hiddenTruth",
      "强制说完整答案",
    ];

    for (const objectiveId of coreObjectiveIds) {
      for (const level of [1, 2, 3] as const) {
        const hint = getHintForObjective(objectiveId, level);
        for (const phrase of forbidden) {
          expect(hint.text).not.toContain(phrase);
        }
      }
    }
  });

  it("keeps level 1 more general than level 3", () => {
    const level1 = getHintForObjective("investigate_memory_reader", 1);
    const level3 = getHintForObjective("investigate_memory_reader", 3);

    expect(level1.text).not.toContain("记忆读取器");
    expect(level3.text).toContain("记忆读取器");
  });

  it("returns progressive hints and the next unused hint", () => {
    const state = createNewSession();
    const objective = getCurrentObjective(state);

    const hints = getProgressiveHints(state, objective);
    const nextHint = getNextHint(state, objective, 1);

    expect(hints).toHaveLength(3);
    expect(nextHint.level).toBe(2);
  });
});
