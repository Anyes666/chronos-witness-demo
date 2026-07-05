import { describe, expect, it } from "vitest";
import {
  generateClueJournal,
  getClueJournalSummary,
  getCriticalClues,
  getStableFactNotes,
} from "../src/engine/clueJournalEngine";
import { createNewSession } from "../src/engine/sessionEngine";
import { discoverEvidence } from "../src/engine/evidenceEngine";
import { askNpc } from "../src/engine/testimonyEngine";
import { performRewind } from "../src/engine/rewindEngine";

describe("clueJournalEngine", () => {
  it("returns no discovered clue entries when nothing has been found", () => {
    const state = createNewSession();

    const journal = generateClueJournal(state);

    expect(journal.every((entry) => entry.type === "system_note")).toBe(true);
    expect(journal.some((entry) => entry.discovered)).toBe(false);
  });

  it("creates a memory reader clue after E2 is discovered", () => {
    let state = createNewSession();
    state = discoverEvidence(state, "E2_MEMORY_READER");

    const journal = generateClueJournal(state);
    const memoryReader = journal.find((entry) =>
      entry.relatedEvidenceIds?.includes("E2_MEMORY_READER"),
    );

    expect(memoryReader).toBeDefined();
    expect(memoryReader?.importance).toMatch(/high|critical/);
  });

  it("creates testimony notes after a witness has been questioned", () => {
    let state = createNewSession();
    state = askNpc(
      { npcId: "lin_xu", questionId: "q1", questionStyle: "confirm" },
      state,
    ).state;

    const journal = generateClueJournal(state);

    expect(journal.some((entry) => entry.type === "stable_fact")).toBe(true);
  });

  it("does not duplicate repeated evidence entries", () => {
    let state = createNewSession();
    state = discoverEvidence(state, "E2_MEMORY_READER");
    state = discoverEvidence(state, "E2_MEMORY_READER");

    const journal = generateClueJournal(state);
    const entries = journal.filter((entry) =>
      entry.relatedEvidenceIds?.includes("E2_MEMORY_READER"),
    );

    expect(entries).toHaveLength(1);
  });

  it("returns critical clues for key evidence and conflict entries", () => {
    let state = createNewSession();
    state = discoverEvidence(state, "E2_MEMORY_READER");
    state = performRewind(state);
    state = askNpc(
      { npcId: "lin_xu", questionId: "q2", questionStyle: "press" },
      state,
    ).state;

    const criticalClues = getCriticalClues(state);

    expect(criticalClues.length).toBeGreaterThan(0);
    expect(criticalClues.some((entry) => entry.type === "evidence")).toBe(true);
  });

  it("summarizes evidence, stable facts, conflicts, and critical clues", () => {
    let state = createNewSession();
    state = discoverEvidence(state, "E2_MEMORY_READER");
    state = askNpc(
      { npcId: "lao_he", questionId: "q1", questionStyle: "confirm" },
      state,
    ).state;

    const summary = getClueJournalSummary(state);
    const stableFacts = getStableFactNotes(state);

    expect(summary.evidenceCount).toBe(1);
    expect(summary.stableFactCount).toBe(stableFacts.length);
    expect(summary.criticalCount).toBeGreaterThanOrEqual(1);
  });
});
