import { describe, expect, it } from "vitest";
import {
  getCurrentObjective,
  getObjectiveDisplayMeta,
  getObjectiveList,
  getObjectiveProgress,
} from "../src/engine/objectiveEngine";
import { createNewSession } from "../src/engine/sessionEngine";
import { discoverEvidence } from "../src/engine/evidenceEngine";
import { askNpc } from "../src/engine/testimonyEngine";
import { performRewind } from "../src/engine/rewindEngine";
import { submitAccusation } from "../src/engine/accusationEngine";

describe("objectiveEngine", () => {
  it("starts by asking the player to investigate E2", () => {
    const state = createNewSession();

    const objective = getCurrentObjective(state);

    expect(objective.id).toBe("investigate_memory_reader");
    expect(objective.targetPanel).toBe("scene");
    expect(objective.completed).toBe(false);
  });

  it("asks for E1 after E2 has been found", () => {
    let state = createNewSession();
    state = discoverEvidence(state, "E2_MEMORY_READER");

    expect(getCurrentObjective(state).id).toBe("investigate_wall_scratches");
  });

  it("asks the player to interrogate after E1 and E2 have been found", () => {
    let state = createNewSession();
    state = discoverEvidence(state, "E2_MEMORY_READER");
    state = discoverEvidence(state, "E1_WALL_SCRATCHES");

    const objective = getCurrentObjective(state);

    expect(objective.category).toBe("interrogate");
    expect(objective.targetPanel).toBe("npcs");
  });

  it("asks for the first rewind once testimony exists at round 0", () => {
    let state = createNewSession();
    state = discoverEvidence(state, "E2_MEMORY_READER");
    state = discoverEvidence(state, "E1_WALL_SCRATCHES");
    state = askNpc(
      { npcId: "lao_he", questionId: "q1", questionStyle: "confirm" },
      state,
    ).state;

    expect(getCurrentObjective(state).id).toBe("perform_first_rewind");
  });

  it("asks the player to open the testimony board after round 1", () => {
    let state = createNewSession();
    state = discoverEvidence(state, "E2_MEMORY_READER");
    state = discoverEvidence(state, "E1_WALL_SCRATCHES");
    state = askNpc(
      { npcId: "lao_he", questionId: "q1", questionStyle: "confirm" },
      state,
    ).state;
    state = performRewind(state);

    expect(getCurrentObjective(state).id).toBe("open_testimony_board");
  });

  it("asks for accusation at round 3", () => {
    let state = createNewSession();
    state = performRewind(state);
    state = performRewind(state);
    state = performRewind(state);

    const objective = getCurrentObjective(state);

    expect(objective.category).toBe("accuse");
    expect(objective.targetPanel).toBe("accusation");
  });

  it("asks the player to review the ending and export the log after an ending exists", () => {
    let state = createNewSession();
    state = submitAccusation(
      { whoCausedDeath: "lin_xu", whichVersionToFix: "forced_rewind" },
      state,
    ).state;

    expect(getCurrentObjective(state).id).toBe("review_ending_export_log");
  });

  it("returns a progress summary for the objective list", () => {
    let state = createNewSession();
    state = discoverEvidence(state, "E2_MEMORY_READER");

    const objectives = getObjectiveList(state);
    const progress = getObjectiveProgress(state);

    expect(objectives.length).toBeGreaterThan(4);
    expect(progress.total).toBe(objectives.length);
    expect(progress.completed).toBeGreaterThanOrEqual(1);
    expect(progress.percent).toBeGreaterThan(0);
  });

  it("provides display metadata for every objective category", () => {
    expect(getObjectiveDisplayMeta("investigate")).toEqual({
      label: "调查",
      badgeVariant: "info",
    });
    expect(getObjectiveDisplayMeta("interrogate").label).toBe("询问");
    expect(getObjectiveDisplayMeta("compare").label).toBe("比对");
    expect(getObjectiveDisplayMeta("rewind").label).toBe("回溯");
    expect(getObjectiveDisplayMeta("accuse").label).toBe("指控");
  });
});
