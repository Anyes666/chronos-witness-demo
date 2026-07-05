import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const repoRoot = process.cwd();

function readSource(path: string): string {
  return readFileSync(join(repoRoot, path), "utf8");
}

describe("Zustand selector safety", () => {
  it("does not call getRawState inside UI store selectors", () => {
    const files = [
      "src/components/game/DesktopInvestigationScreen.tsx",
      "src/components/game/MobileInvestigationScreen.tsx",
      "src/components/game/TestimonyBoard.tsx",
    ];

    for (const file of files) {
      expect(readSource(file)).not.toContain("useGameStore((s) => s.getRawState())");
    }
  });

  it("uses the stable game save hook for derived UI state", () => {
    const hook = readSource("src/components/game/useGameSaveData.ts");

    expect(hook).toContain("useMemo");
    expect(hook).toContain("const currentRound = useGameStore((s) => s.currentRound)");
    expect(hook).not.toContain("s.getRawState()");
  });
});
