// ============================================================
// case.meta.ts — 案件元信息
// ============================================================

import type { CaseMeta } from "../../../engine/types";

export const DEMO_CASE_META: CaseMeta = {
  caseId: "demo_shm_001",
  title: "废弃档案馆",
  subtitle: "沈鹤鸣死亡案",
  briefing: `真相庭高级仲裁官沈鹤鸣被发现死于废弃档案馆主室，死因为「自诱导记忆碎裂」。

档案已封存。官方结论是：沈鹤鸣在调取「原始记忆」文件时研究过深，自行回溯至碎裂。

但旧档案里有一行注解：
「主记录仪在 23:17 信号中断 0.4 秒。原因：未知。」

作为时序证人，你的工作是回溯案发时空，比对证词漂移，找出真相。
你的回溯额度是 3 次。每一次回溯都会扰动记忆——让真相更近，也让真相更远。`,
  npcIds: ["lin_xu", "lao_he", "doctor_lu"],
  maxRewinds: 3,
  locations: ["main_room", "side_room", "duty_room", "main_entrance", "side_door"],
};
