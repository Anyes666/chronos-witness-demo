import { describe, it, expect } from "vitest";
import {
  submitAccusation,
  determineEnding,
  evaluateEvidenceCoverage,
} from "../src/engine/accusationEngine";
import { createNewSession } from "../src/engine/sessionEngine";
import { discoverEvidence } from "../src/engine/evidenceEngine";

describe("accusationEngine", () => {
  it("发现 E1/E2/E3 后 coverage 为 high", () => {
    let state = createNewSession();
    state = discoverEvidence(state, "E1_WALL_SCRATCHES");
    state = discoverEvidence(state, "E2_MEMORY_READER");
    state = discoverEvidence(state, "E3_LIGHT_LOG");
    expect(evaluateEvidenceCoverage(state)).toBe("high");
  });

  it("选择 forced_rewind 进入 refuse_closure", () => {
    const state = createNewSession();
    const result = determineEnding(
      { whoCausedDeath: "lin_xu", whichVersionToFix: "forced_rewind" },
      state,
    );
    expect(result).toBe("refuse_closure");
  });

  it("选择 official_self_induced 进入 obey_closure", () => {
    const state = createNewSession();
    const result = determineEnding(
      {
        whoCausedDeath: "shen_heming_self",
        whichVersionToFix: "official_self_induced",
      },
      state,
    );
    expect(result).toBe("obey_closure");
  });

  it("提交指控后 state.endingId 被设置", () => {
    let state = createNewSession();
    const { state: newState, result } = submitAccusation(
      { whoCausedDeath: "lin_xu", whichVersionToFix: "forced_rewind" },
      state,
    );
    expect(newState.endingId).toBe("refuse_closure");
    expect(result.endingId).toBe("refuse_closure");
  });
});
