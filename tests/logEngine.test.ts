import { describe, it, expect } from "vitest";
import {
  createActionLog,
  exportPlaytestLog,
} from "../src/engine/logEngine";
import { createNewSession } from "../src/engine/sessionEngine";
import { askNpc } from "../src/engine/testimonyEngine";
import { performRewind } from "../src/engine/rewindEngine";
import { submitAccusation } from "../src/engine/accusationEngine";

describe("logEngine", () => {
  it("askNpc 后有 ask_npc 日志", () => {
    let state = createNewSession();
    const { state: s1 } = askNpc(
      { npcId: "lin_xu", questionId: "q1", questionStyle: "confirm" },
      state,
    );
    const askLogs = s1.actionLogs.filter((l) => l.actionType === "ask_npc");
    expect(askLogs.length).toBe(1);
  });

  it("rewind 后有 rewind 日志", () => {
    const state = createNewSession();
    const s1 = performRewind(state);
    const rewindLogs = s1.actionLogs.filter((l) => l.actionType === "rewind");
    expect(rewindLogs.length).toBe(1);
  });

  it("submitAccusation 后有 accuse 日志", () => {
    let state = createNewSession();
    const { state: s1 } = submitAccusation(
      { whoCausedDeath: "lin_xu", whichVersionToFix: "forced_rewind" },
      state,
    );
    const accuseLogs = s1.actionLogs.filter((l) => l.actionType === "accuse");
    expect(accuseLogs.length).toBe(1);
  });

  it("exportPlaytestLog 包含 sessionId, startedAt, endedAt, actions, accusation", () => {
    let state = createNewSession();
    const { state: s1 } = askNpc(
      { npcId: "lin_xu", questionId: "q1", questionStyle: "confirm" },
      state,
    );
    const { state: s2 } = submitAccusation(
      { whoCausedDeath: "lin_xu", whichVersionToFix: "forced_rewind" },
      s1,
    );

    const log = exportPlaytestLog(s2);
    expect(log.sessionId).toBeTruthy();
    expect(log.startedAt).toBeTruthy();
    expect(log.endedAt).toBeTruthy();
    expect(log.actions.length).toBeGreaterThan(0);
    expect(log.accusation.endingId).toBe("refuse_closure");
  });

  it("createActionLog 创建正确格式的日志", () => {
    const log = createActionLog({
      actionType: "ask_npc",
      detail: "test",
      currentRound: 0,
    });
    expect(log.actionType).toBe("ask_npc");
    expect(log.round).toBe(0);
    expect(log.timestamp).toBeTruthy();
  });
});
