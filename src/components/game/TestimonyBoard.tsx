// src/components/game/TestimonyBoard.tsx
import { useGameStore } from "../../engine/gameStore";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { DEMO_NPCS } from "../../data/cases/demo_shm_001/witnesses";
import { useState } from "react";
import type { NpcId } from "../../engine/types";

export function TestimonyBoard() {
  const getTestimonyBoard = useGameStore((s) => s.getTestimonyBoard);
  const getStableFactCoverage = useGameStore((s) => s.getStableFactCoverage);
  const [selectedNpc, setSelectedNpc] = useState<NpcId | null>(null);

  const board = getTestimonyBoard();
  const coverage = getStableFactCoverage();

  if (board.length === 0) {
    return (
      <div className="p-4 text-center text-slate-600 py-12">
        <p className="text-4xl mb-3">📋</p>
        <p>证词对照板为空</p>
        <p className="text-xs mt-2">先去「证人」Tab 询问 NPC</p>
      </div>
    );
  }

  const npcFiltered = selectedNpc ? board.filter((r) => r.npcId === selectedNpc) : board;

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-lg font-semibold text-slate-300">📋 证词对照板</h3>

      {/* NPC 筛选 */}
      <div className="flex gap-2 flex-wrap">
        <Button
          size="sm"
          variant={!selectedNpc ? "primary" : "ghost"}
          onClick={() => setSelectedNpc(null)}
        >
          全部
        </Button>
        {DEMO_NPCS.map((npc) => (
          <Button
            key={npc.id}
            size="sm"
            variant={selectedNpc === npc.id ? "primary" : "ghost"}
            onClick={() => setSelectedNpc(npc.id)}
          >
            {npc.name}
          </Button>
        ))}
      </div>

      {/* 稳定事实覆盖 */}
      {coverage.length > 0 && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <p className="text-sm text-slate-400 mb-2">🔒 稳定事实覆盖</p>
          {coverage.map((c) => (
            <div key={c.stableFactId} className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <Badge variant="success">{c.stableFactId}</Badge>
              <span>
                出现 {c.roundCount} 轮 · 轮次 {c.rounds.join(", ")}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* 证词行 */}
      <div className="space-y-3">
        {npcFiltered.map((row, i) => (
          <div
            key={`${row.shellId}-${i}`}
            className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="font-medium text-slate-200 text-sm">{row.npcName}</span>
              <Badge variant="info">第 {row.round} 轮</Badge>
              <Badge variant="warning">漂移 {row.driftLevel}</Badge>
              <span className="text-xs text-slate-600">{row.emotion}</span>
            </div>

            <p className="text-sm text-slate-400 mb-2">{row.summary}</p>

            {row.stableFactIds.length > 0 && (
              <div className="flex gap-1 flex-wrap mb-2">
                <span className="text-xs text-emerald-500">稳定：</span>
                {row.stableFactIds.map((fid) => (
                  <Badge key={fid} variant="success">{fid}</Badge>
                ))}
              </div>
            )}

            <div className="grid grid-cols-3 gap-2 text-xs mt-2">
              {row.changedTokens.length > 0 && (
                <div>
                  <span className="text-amber-500">变化：</span>
                  {row.changedTokens.map((t) => (
                    <span key={t} className="text-amber-400 ml-1">{t}</span>
                  ))}
                </div>
              )}
              {row.newTokens.length > 0 && (
                <div>
                  <span className="text-blue-400">新增：</span>
                  {row.newTokens.map((t) => (
                    <span key={t} className="text-blue-300 ml-1">{t}</span>
                  ))}
                </div>
              )}
              {row.omittedTokens.length > 0 && (
                <div>
                  <span className="text-red-400">消失：</span>
                  {row.omittedTokens.map((t) => (
                    <span key={t} className="text-red-300 ml-1">{t}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
