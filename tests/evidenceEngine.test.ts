import { describe, it, expect } from "vitest";
import {
  inspectLocation,
  getEvidenceById,
  discoverEvidence,
  getEvidenceCoverage,
} from "../src/engine/evidenceEngine";
import { createNewSession } from "../src/engine/sessionEngine";

describe("evidenceEngine", () => {
  it("主室东墙可以发现 E1_WALL_SCRATCHES", () => {
    const evidence = inspectLocation("main_room_east_wall");
    const e1 = evidence.find((e) => e.id === "E1_WALL_SCRATCHES");
    expect(e1).toBeDefined();
  });

  it("电箱可以发现 E3_LIGHT_LOG", () => {
    const evidence = inspectLocation("main_room_power_box");
    const e3 = evidence.find((e) => e.id === "E3_LIGHT_LOG");
    expect(e3).toBeDefined();
  });

  it("重复 discover 同一 evidence 不重复加入", () => {
    let state = createNewSession();
    state = discoverEvidence(state, "E2_MEMORY_READER");
    expect(state.discoveredEvidenceIds.length).toBe(1);
    state = discoverEvidence(state, "E2_MEMORY_READER");
    expect(state.discoveredEvidenceIds.length).toBe(1);
  });

  it("第 0 和第 3 轮可以返回不同描述", () => {
    const d0 = getEvidenceById("E1_WALL_SCRATCHES")!.roundDescriptions[0];
    const d3 = getEvidenceById("E1_WALL_SCRATCHES")!.roundDescriptions[3];
    // 描述应该不同（轮次越高，细节越多）
    expect(d0).not.toBe(d3);
  });

  it("getEvidenceCoverage 计算覆盖率", () => {
    let state = createNewSession();
    state = discoverEvidence(state, "E2_MEMORY_READER");
    state = discoverEvidence(state, "E3_LIGHT_LOG");
    const coverage = getEvidenceCoverage(state);
    expect(coverage.discovered).toBe(2);
    expect(coverage.total).toBe(6);
  });
});
