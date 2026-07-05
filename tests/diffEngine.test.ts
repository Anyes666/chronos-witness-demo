import { describe, it, expect } from "vitest";
import {
  generateTestimonyBoard,
  getNpcRoundComparison,
  getStableFactCoverage,
} from "../src/engine/diffEngine";
import { createNewSession } from "../src/engine/sessionEngine";
import { askNpc } from "../src/engine/testimonyEngine";
import { performRewind } from "../src/engine/rewindEngine";

describe("diffEngine", () => {
  it("询问林叙 0-3 轮后，对照板有 4 条林叙记录", () => {
    let state = createNewSession();

    const { state: s0 } = askNpc(
      { npcId: "lin_xu", questionId: "q1", questionStyle: "confirm" },
      state,
    );
    state = s0;

    state = performRewind(state);
    const { state: s1 } = askNpc(
      { npcId: "lin_xu", questionId: "q1", questionStyle: "confirm" },
      state,
    );
    state = s1;

    state = performRewind(state);
    const { state: s2 } = askNpc(
      { npcId: "lin_xu", questionId: "q1", questionStyle: "confirm" },
      state,
    );
    state = s2;

    state = performRewind(state);
    const { state: s3 } = askNpc(
      { npcId: "lin_xu", questionId: "q1", questionStyle: "confirm" },
      state,
    );

    const board = generateTestimonyBoard(s3.testimonyHistory);
    const linXuRows = board.filter((r) => r.npcId === "lin_xu");
    expect(linXuRows.length).toBe(4);
  });

  it("林叙的稳定事实 F_LIN_2317_SIGNAL 可被统计出来", () => {
    let state = createNewSession();
    for (let r = 0; r <= 3; r++) {
      const { state: ns } = askNpc(
        { npcId: "lin_xu", questionId: `q${r}`, questionStyle: "confirm" },
        state,
      );
      state = ns;
      if (r < 3) state = performRewind(state);
    }

    const board = generateTestimonyBoard(state.testimonyHistory);
    const linRows = board.filter((r) => r.npcId === "lin_xu");
    const hasSignal = linRows.some((r) =>
      r.stableFactIds.includes("F_LIN_2317_SIGNAL"),
    );
    expect(hasSignal).toBe(true);
  });

  it("changedTokens / newTokens / omittedTokens 能被正确输出", () => {
    let state = createNewSession();
    // 询问林叙第 2 轮（漂移最大的轮次）
    state = performRewind(state);
    state = performRewind(state);
    const { state: s2 } = askNpc(
      { npcId: "lin_xu", questionId: "q1", questionStyle: "press" },
      state,
    );

    const board = generateTestimonyBoard(s2.testimonyHistory);
    const row = board[0];
    expect(row.changedTokens.length).toBeGreaterThan(0);
    expect(row.newTokens.length).toBeGreaterThan(0);
  });

  it("getNpcRoundComparison 按轮次返回对比数据", () => {
    const comparison = getNpcRoundComparison("lin_xu", []);
    expect(comparison.npcId).toBe("lin_xu");
    expect(comparison.rounds.length).toBe(4);
    expect(comparison.rounds[0].round).toBe(0);
    expect(comparison.rounds[3].round).toBe(3);
  });

  it("getStableFactCoverage 返回稳定事实覆盖", () => {
    let state = createNewSession();
    const { state: s0 } = askNpc(
      { npcId: "lin_xu", questionId: "q1", questionStyle: "confirm" },
      state,
    );

    const coverage = getStableFactCoverage(s0.testimonyHistory);
    expect(coverage.length).toBeGreaterThan(0);
    const linCoverage = coverage.find(
      (c) => c.stableFactId === "F_LIN_2317_SIGNAL",
    );
    expect(linCoverage).toBeDefined();
  });
});
