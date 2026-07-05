import { describe, expect, it } from "vitest";
import {
  canTransition,
  getDefaultPhaseAfterNewGame,
  getNextAllowedPhases,
  type GameFlowState,
} from "../src/engine/gameFlowEngine";
import { useUiLayerStore } from "../src/engine/uiLayerStore";
import { createNewSession } from "../src/engine/sessionEngine";
import { performRewind } from "../src/engine/rewindEngine";

function baseState(overrides: Partial<GameFlowState> = {}): GameFlowState {
  return {
    currentRound: 0,
    discoveredEvidenceIds: [],
    testimonyHistory: [],
    endingId: undefined,
    ...overrides,
  };
}

describe("gameFlowEngine", () => {
  it("allows the linear page transitions", () => {
    const state = baseState();

    expect(canTransition("start", "briefing", state)).toBe(true);
    expect(canTransition("briefing", "investigation", state)).toBe(true);
    expect(canTransition("accusation", "ending", state)).toBe(true);
    expect(canTransition("ending", "start", state)).toBe(true);
  });

  it("rejects illegal page jumps without throwing", () => {
    const state = baseState();

    expect(canTransition("start", "accusation", state)).toBe(false);
    expect(canTransition("briefing", "ending", state)).toBe(false);
    expect(canTransition("ending", "accusation", state)).toBe(false);
  });

  it("blocks accusation from investigation when evidence is insufficient", () => {
    const state = baseState({
      currentRound: 0,
      discoveredEvidenceIds: ["E2_MEMORY_READER"],
      testimonyHistory: [],
    });

    expect(canTransition("investigation", "accusation", state)).toBe(false);
  });

  it("allows accusation from investigation after reaching round 3", () => {
    let state = createNewSession();
    state = performRewind(state);
    state = performRewind(state);
    state = performRewind(state);

    expect(canTransition("investigation", "accusation", state)).toBe(true);
  });

  it("returns the default new-game phase and next allowed phases", () => {
    expect(getDefaultPhaseAfterNewGame()).toBe("briefing");
    expect(getNextAllowedPhases("start", baseState())).toEqual(["briefing"]);
    expect(getNextAllowedPhases("investigation", baseState())).toEqual([]);
  });
});

describe("uiLayerStore", () => {
  it("blocks input while a modal is open and releases it when closed", () => {
    const store = useUiLayerStore.getState();

    store.closeOverlay();
    store.closeModal();
    store.clearRewindEffect();
    useUiLayerStore.getState().openModal("tutorial");

    expect(useUiLayerStore.getState().isBlockingInput()).toBe(true);

    useUiLayerStore.getState().closeModal();

    expect(useUiLayerStore.getState().isBlockingInput()).toBe(false);
  });

  it("manages overlay and modal independently", () => {
    useUiLayerStore.getState().closeOverlay();
    useUiLayerStore.getState().closeModal();

    useUiLayerStore.getState().openOverlay("board");
    useUiLayerStore.getState().openModal("confirmRewind");

    expect(useUiLayerStore.getState().overlayPanel).toBe("board");
    expect(useUiLayerStore.getState().modalType).toBe("confirmRewind");

    useUiLayerStore.getState().closeOverlay();

    expect(useUiLayerStore.getState().overlayPanel).toBe("none");
    expect(useUiLayerStore.getState().modalType).toBe("confirmRewind");
  });

  it("can trigger and clear the rewind effect", () => {
    useUiLayerStore.getState().clearRewindEffect();

    useUiLayerStore.getState().triggerRewindEffect();

    expect(useUiLayerStore.getState().rewindEffectActive).toBe(true);
    expect(useUiLayerStore.getState().isBlockingInput()).toBe(true);

    useUiLayerStore.getState().clearRewindEffect();

    expect(useUiLayerStore.getState().rewindEffectActive).toBe(false);
  });
});
