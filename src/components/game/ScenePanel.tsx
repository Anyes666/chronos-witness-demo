// src/components/game/ScenePanel.tsx
import { useState } from "react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { useGameStore } from "../../engine/gameStore";
import { DEMO_LOCATIONS } from "../../data/cases/demo_shm_001/scene";
import type { Evidence } from "../../engine/types";

export function ScenePanel() {
  const inspectLocation = useGameStore((s) => s.inspectLocation);
  const discoverEvidence = useGameStore((s) => s.discoverEvidence);
  const discoveredEvidenceIds = useGameStore((s) => s.discoveredEvidenceIds);
  const getEvidenceDescription = useGameStore((s) => s.getEvidenceDescription);
  const [selected, setSelected] = useState<Evidence[] | null>(null);
  const [selectedLoc, setSelectedLoc] = useState("");

  const locations = DEMO_LOCATIONS.filter((l) => l.evidenceIds.length > 0);

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-lg font-semibold text-slate-300">🏛️ 档案馆现场</h3>

      {locations.map((loc) => {
        const allFound = loc.evidenceIds.every((eid) =>
          discoveredEvidenceIds.includes(eid),
        );
        return (
          <Card
            key={loc.id}
            highlighted={selectedLoc === loc.id}
            onClick={() => {
              setSelected(inspectLocation(loc.id));
              setSelectedLoc(loc.id);
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-200">{loc.name}</p>
                <p className="text-xs text-slate-500 mt-1">
                  {loc.description.slice(0, 60)}…
                </p>
              </div>
              <span className={`text-xs ${allFound ? "text-emerald-500" : "text-slate-600"}`}>
                {allFound ? "已调查" : `${loc.evidenceIds.length} 物证`}
              </span>
            </div>
          </Card>
        );
      })}

      {selected && selected.length > 0 && (
        <div className="mt-4 space-y-2 border-t border-slate-800 pt-4">
          <p className="text-sm text-slate-400">发现物证：</p>
          {selected.map((ev) => {
            const found = discoveredEvidenceIds.includes(ev.id);
            return (
              <div
                key={ev.id}
                className="flex items-center justify-between bg-slate-800/50 rounded-lg p-3"
              >
                <div>
                  <p className="font-medium text-slate-200 text-sm">{ev.name}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {found
                      ? getEvidenceDescription(ev.id)
                      : ev.kernelDescription.slice(0, 60)}
                    …
                  </p>
                </div>
                {!found && (
                  <Button size="sm" onClick={() => discoverEvidence(ev.id)}>
                    调查
                  </Button>
                )}
                {found && <span className="text-emerald-500 text-xs">✓ 已发现</span>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
