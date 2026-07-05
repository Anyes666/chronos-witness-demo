/* @vitest-environment jsdom */
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createNewSession } from "../src/engine/sessionEngine";
import { useGameStore } from "../src/engine/gameStore";
import { getCurrentObjective } from "../src/engine/objectiveEngine";
import { DesktopInvestigationScreen } from "../src/components/game/DesktopInvestigationScreen";
import { HintButton } from "../src/components/game/HintButton";
import { InvestigationFallback } from "../src/components/game/InvestigationFallback";
import { ObjectivePanel } from "../src/components/game/ObjectivePanel";

vi.mock("../src/components/three/ThreeGameRoot", () => ({
  ThreeGameRoot: () => <div data-testid="three-root" />,
  setOverlayOpen: vi.fn(),
}));

vi.mock("../src/components/three/ThirdPersonController", () => ({
  controllerEvents: {
    unlock: vi.fn(),
    lock: vi.fn(),
  },
}));

describe("investigation render safety", () => {
  beforeEach(() => {
    localStorage.clear();
    useGameStore.getState().newGame();
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("renders DesktopInvestigationScreen without throwing", () => {
    render(<DesktopInvestigationScreen onAccuse={vi.fn()} />);

    expect(screen.getByTestId("three-root")).toBeTruthy();
  });

  it("renders ObjectivePanel and HintButton from a stable save snapshot", () => {
    const state = createNewSession();
    const objective = getCurrentObjective(state);

    render(
      <>
        <ObjectivePanel state={state} mode="desktop" onAction={vi.fn()} />
        <HintButton state={state} objective={objective} />
      </>,
    );

    expect(screen.getAllByRole("button").length).toBeGreaterThanOrEqual(2);
  });

  it("renders the investigation fallback controls", () => {
    render(
      <InvestigationFallback
        error={new Error("boom")}
        onRefresh={vi.fn()}
        onSwitchTo2D={vi.fn()}
      />,
    );

    expect(screen.getByText("调查场景加载失败")).toBeTruthy();
    expect(screen.getByText("切换 2D 调查模式")).toBeTruthy();
  });
});
