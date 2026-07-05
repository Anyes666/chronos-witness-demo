import { describe, it, expect } from "vitest";
import {
  calculateQuestionDrift,
  calculateRepeatPenalty,
  getEntropyLabel,
} from "../src/engine/driftEngine";
import type { PlayerActionLog } from "../src/engine/types";

describe("driftEngine", () => {
  it("逼问漂移大于确认式", () => {
    expect(calculateQuestionDrift("press")).toBeGreaterThan(
      calculateQuestionDrift("confirm"),
    );
  });

  it("silent_observe 漂移为 0", () => {
    expect(calculateQuestionDrift("silent_observe")).toBe(0);
  });

  it("重复提问会增加惩罚", () => {
    const logs: PlayerActionLog[] = [
      {
        timestamp: "",
        round: 0,
        actionType: "ask_npc",
        detail: JSON.stringify({ npcId: "lin_xu", questionId: "q1" }),
      },
      {
        timestamp: "",
        round: 0,
        actionType: "ask_npc",
        detail: JSON.stringify({ npcId: "lin_xu", questionId: "q1" }),
      },
    ];
    const penalty = calculateRepeatPenalty(logs, "lin_xu", "q1");
    expect(penalty).toBeGreaterThan(0);
  });

  it("没有重复提问时惩罚为 0", () => {
    const penalty = calculateRepeatPenalty([], "lin_xu", "q1");
    expect(penalty).toBe(0);
  });

  it("entropy < 30 为 stable", () => {
    expect(getEntropyLabel(0)).toBe("stable");
    expect(getEntropyLabel(29)).toBe("stable");
  });

  it("30 <= entropy < 60 为 unstable", () => {
    expect(getEntropyLabel(30)).toBe("unstable");
    expect(getEntropyLabel(59)).toBe("unstable");
  });

  it("entropy >= 60 为 critical", () => {
    expect(getEntropyLabel(60)).toBe("critical");
    expect(getEntropyLabel(100)).toBe("critical");
  });
});
