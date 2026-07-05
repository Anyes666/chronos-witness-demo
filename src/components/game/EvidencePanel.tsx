// src/components/game/EvidencePanel.tsx
import { useGameStore } from "../../engine/gameStore";
import { getEvidenceById } from "../../engine/evidenceEngine";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";

export function EvidencePanel() {
  const discoveredEvidenceIds = useGameStore((s) => s.discoveredEvidenceIds);
  const getEvidenceDescription = useGameStore((s) => s.getEvidenceDescription);

  if (discoveredEvidenceIds.length === 0) {
    return (
      <div className="p-4 text-center text-slate-600 py-12">
        <p className="text-4xl mb-3">🔍</p>
        <p>尚未发现任何物证</p>
        <p className="text-xs mt-2">前往「现场」Tab 调查地点</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-3">
      <h3 className="text-lg font-semibold text-slate-300">🔍 已发现物证</h3>
      {discoveredEvidenceIds.map((eid) => {
        const ev = getEvidenceById(eid);
        if (!ev) return null;
        return (
          <Card key={eid}>
            <div className="flex items-start gap-2 mb-2">
              <p className="font-medium text-slate-200 text-sm flex-1">{ev.name}</p>
              <div className="flex gap-1 flex-wrap">
                {ev.tags.map((t) => (
                  <Badge key={t} variant="info">
                    {t}
                  </Badge>
                ))}
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {getEvidenceDescription(eid)}
            </p>
            {ev.linkedStableFactIds.length > 0 && (
              <p className="text-xs text-amber-600 mt-2">
                关联稳定事实：{ev.linkedStableFactIds.join(", ")}
              </p>
            )}
          </Card>
        );
      })}
    </div>
  );
}
