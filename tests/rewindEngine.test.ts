import { describe, it, expect } from "vitest";
import { createNewSession } from "../src/engine/sessionEngine";
import { performRewind, canRewind, getRemainingRewinds } from "../src/engine/rewindEngine";

describe("rewindEngine", () => {
  it("第 0 轮可以回溯", () => {
    expect(canRewind(0)).toBe(true);
  });

  it("第 1 轮可以回溯", () => {
    expect(canRewind(1)).toBe(true);
  });

  it("第 2 轮可以回溯", () => {
    expect(canRewind(2)).toBe(true);
  });

  it("第 3 轮不能回溯", () => {
    expect(canRewind(3)).toBe(false);
  });

  it("每次回溯 entropy 增加 15", () => {
    const state = createNewSession();
    expect(state.currentRound).toBe(0);
    expect(state.entropy).toBe(0);

    const s1 = performRewind(state);
    expect(s1.currentRound).toBe(1);
    expect(s1.entropy).toBe(15);

    const s2 = performRewind(s1);
    expect(s2.currentRound).toBe(2);
    expect(s2.entropy).toBe(30);

    const s3 = performRewind(s2);
    expect(s3.currentRound).toBe(3);
    expect(s3.entropy).toBe(45);
  });

  it("第 3 轮回溯抛出错误", () => {
    let state = createNewSession();
    state = performRewind(state); // 1
    state = performRewind(state); // 2
    state = performRewind(state); // 3
    expect(() => performRewind(state)).toThrow("Cannot rewind");
  });

  it("记录回溯日志", () => {
    const state = createNewSession();
    const s1 = performRewind(state);
    const rewindLogs = s1.actionLogs.filter((l) => l.actionType === "rewind");
    expect(rewindLogs.length).toBe(1);
  });

  it("getRemainingRewinds 正确计算剩余次数", () => {
    expect(getRemainingRewinds(0)).toBe(3);
    expect(getRemainingRewinds(1)).toBe(2);
    expect(getRemainingRewinds(2)).toBe(1);
    expect(getRemainingRewinds(3)).toBe(0);
  });
});
