import { describe, it, expect } from "vitest";
import {
  getTestimonyShell,
  askNpc,
} from "../src/engine/testimonyEngine";
import { createNewSession } from "../src/engine/sessionEngine";
import { performRewind } from "../src/engine/rewindEngine";

describe("testimonyEngine", () => {
  it("林叙第 0 轮返回第 0 轮证词", () => {
    const shell = getTestimonyShell("lin_xu", 0);
    expect(shell).toBeDefined();
    expect(shell!.npcId).toBe("lin_xu");
    expect(shell!.round).toBe(0);
  });

  it("回溯到第 1 轮后返回第 1 轮证词", () => {
    const shell = getTestimonyShell("lin_xu", 1);
    expect(shell).toBeDefined();
    expect(shell!.round).toBe(1);
  });

  it("每次询问 testimonyHistory 长度 +1", () => {
    let state = createNewSession();
    const { state: s1 } = askNpc(
      { npcId: "lin_xu", questionId: "q1", questionStyle: "confirm" },
      state,
    );
    expect(s1.testimonyHistory.length).toBe(1);

    const { state: s2 } = askNpc(
      { npcId: "lao_he", questionId: "q2", questionStyle: "confirm" },
      s1,
    );
    expect(s2.testimonyHistory.length).toBe(2);
  });

  it("stableFactIds 必须存在且非空", () => {
    const shells = ["lin_xu", "lao_he", "doctor_lu"] as const;
    for (const npc of shells) {
      for (let r = 0; r <= 3; r++) {
        const shell = getTestimonyShell(npc, r as 0 | 1 | 2 | 3);
        expect(shell, `Missing shell for ${npc} round ${r}`).toBeDefined();
        expect(
          shell!.stableFactIds.length,
          `No stable facts for ${npc} round ${r}`,
        ).toBeGreaterThanOrEqual(1);
      }
    }
  });

  it("回溯后证词内容不同（漂移验证）", () => {
    let state = createNewSession();
    const { testimony: t0 } = askNpc(
      { npcId: "lin_xu", questionId: "q_location", questionStyle: "confirm" },
      state,
    );
    expect(t0.round).toBe(0);

    state = performRewind(state);
    const { testimony: t1 } = askNpc(
      { npcId: "lin_xu", questionId: "q_location", questionStyle: "confirm" },
      state,
    );
    expect(t1.round).toBe(1);

    // 两轮证词应该不同
    expect(t0.fullText).not.toBe(t1.fullText);
  });

  it("silent_observe 不增加 entropy", () => {
    let state = createNewSession();
    const beforeEntropy = state.entropy;
    const { state: s1 } = askNpc(
      { npcId: "lin_xu", questionId: "q_silent", questionStyle: "silent_observe" },
      state,
    );
    expect(s1.entropy).toBe(beforeEntropy);
  });
});
