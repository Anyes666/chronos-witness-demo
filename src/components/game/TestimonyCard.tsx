// src/components/game/TestimonyCard.tsx
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import type { TestimonyRecord } from "../../engine/types";
import { DEMO_NPCS } from "../../data/cases/demo_shm_001/witnesses";

interface TestimonyCardProps {
  testimony: TestimonyRecord;
}

const emotionLabel: Record<string, string> = {
  calm: "冷静",
  defensive: "防御",
  fearful: "恐惧",
  hostile: "敌意",
  evasive: "回避",
};

const emotionVariant: Record<string, "success" | "warning" | "danger" | "info" | "default"> = {
  calm: "success",
  defensive: "warning",
  fearful: "danger",
  hostile: "danger",
  evasive: "info",
};

export function TestimonyCard({ testimony }: TestimonyCardProps) {
  const npc = DEMO_NPCS.find((n) => n.id === testimony.npcId);

  return (
    <Card>
      <div className="flex items-center gap-2 mb-2">
        <span className="font-medium text-slate-200 text-sm">
          {npc?.name ?? testimony.npcId}
        </span>
        <Badge variant="info">第 {testimony.round} 轮</Badge>
        <Badge variant={emotionVariant[testimony.emotion] ?? "default"}>
          {emotionLabel[testimony.emotion] ?? testimony.emotion}
        </Badge>
      </div>
      <p className="text-sm text-slate-400 leading-relaxed whitespace-pre-wrap">
        {testimony.fullText}
      </p>
      <div className="flex gap-2 mt-2 text-xs text-slate-600">
        <span>提问方式：{testimony.questionStyle}</span>
        <span>漂移等级：{testimony.driftLevel}</span>
      </div>
    </Card>
  );
}
