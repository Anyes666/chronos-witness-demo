import { describe, expect, it } from "vitest";
import {
  TUTORIAL_STORAGE_KEY,
  TUTORIAL_STEPS,
} from "../src/components/game/TutorialOverlay";

const forbiddenPhrases = [
  "林叙是真凶",
  "真凶是林叙",
  "hiddenTruth",
  "强制第七次完整答案",
];

describe("TutorialOverlay copy", () => {
  it("uses the stable tutorial localStorage key", () => {
    expect(TUTORIAL_STORAGE_KEY).toBe("chronos_tutorial_seen");
  });

  it("has exactly four short tutorial steps", () => {
    expect(TUTORIAL_STEPS).toHaveLength(4);
    for (const step of TUTORIAL_STEPS) {
      expect(step.bullets.length).toBeGreaterThanOrEqual(3);
      expect(step.bullets.length).toBeLessThanOrEqual(5);
    }
  });

  it("does not leak the final answer", () => {
    const copy = TUTORIAL_STEPS
      .flatMap((step) => [step.title, ...step.bullets])
      .join("\n");

    for (const phrase of forbiddenPhrases) {
      expect(copy).not.toContain(phrase);
    }
  });
});
