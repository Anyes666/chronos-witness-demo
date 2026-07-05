// src/components/game/NpcPanel.tsx
import { useState } from "react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { DEMO_NPCS } from "../../data/cases/demo_shm_001/witnesses";
import type { NpcId, QuestionStyle, EvidenceId } from "../../engine/types";
import { useGameStore } from "../../engine/gameStore";
import { TestimonyCard } from "./TestimonyCard";

export function NpcPanel() {
  const [selectedNpc, setSelectedNpc] = useState<NpcId | null>(null);
  const [showQuestion, setShowQuestion] = useState(false);

  const askNpc = useGameStore((s) => s.askNpc);
  const testimonyHistory = useGameStore((s) => s.testimonyHistory);
  const discoveredEvidenceIds = useGameStore((s) => s.discoveredEvidenceIds);

  const handleAsk = (style: QuestionStyle, evidenceId?: EvidenceId) => {
    if (!selectedNpc) return;
    askNpc({
      npcId: selectedNpc,
      questionId: `q_${style}_${Date.now()}`,
      questionStyle: style,
      evidenceId,
    });
    setShowQuestion(false);
  };

  const npcTestimonies = testimonyHistory.filter(
    (t) => t.npcId === selectedNpc,
  );

  const QUESTION_STYLES: { style: QuestionStyle; label: string; desc: string }[] = [
    { style: "confirm", label: "确认式", desc: "封闭提问，信息少漂移小" },
    { style: "press", label: "逼问式", desc: "施压追问，信息强但可能说谎" },
    { style: "empathize", label: "共情式", desc: "解锁情绪记忆，可能偏离事实" },
    { style: "silent_observe", label: "沉默观察", desc: "不污染证词，靠环境线索" },
    { style: "present_evidence", label: "出示证据", desc: "锁定一段，破坏另一段" },
  ];

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-lg font-semibold text-slate-300">👤 证人</h3>

      {DEMO_NPCS.map((npc) => (
        <Card
          key={npc.id}
          highlighted={selectedNpc === npc.id}
          onClick={() => setSelectedNpc(npc.id)}
        >
          <p className="font-medium text-slate-200">{npc.name}</p>
          <p className="text-xs text-slate-500 mt-1">{npc.surfaceRole}</p>
          <p className="text-xs text-slate-600 italic mt-1">{npc.catchphrase}</p>
        </Card>
      ))}

      {selectedNpc && (
        <div className="border-t border-slate-800 pt-4 space-y-3">
          <Button size="sm" variant="secondary" onClick={() => setShowQuestion(!showQuestion)}>
            {showQuestion ? "取消提问" : "开始询问"}
          </Button>

          {showQuestion && (
            <div className="space-y-2 bg-slate-900/60 rounded-xl p-4">
              <p className="text-sm text-slate-400 mb-2">选择提问方式：</p>
              {QUESTION_STYLES.map((qs) => (
                <Card
                  key={qs.style}
                  onClick={() => handleAsk(qs.style)}
                >
                  <p className="font-medium text-slate-200 text-sm">{qs.label}</p>
                  <p className="text-xs text-slate-500">{qs.desc}</p>
                </Card>
              ))}
              {discoveredEvidenceIds.length > 0 && (
                <div className="mt-3 pt-2 border-t border-slate-800">
                  <p className="text-xs text-slate-500 mb-2">或出示证据：</p>
                  {discoveredEvidenceIds.map((eid) => (
                    <button
                      key={eid}
                      className="block w-full text-left text-xs text-amber-500 hover:text-amber-400 py-1"
                      onClick={() => handleAsk("present_evidence", eid)}
                    >
                      📎 出示 {eid}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {npcTestimonies.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-slate-500">
                已询问 {npcTestimonies.length} 次
              </p>
              {npcTestimonies.map((t, i) => (
                <TestimonyCard key={i} testimony={t} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
