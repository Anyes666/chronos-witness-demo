// ============================================================
// driftEngine.ts — 漂移系统
// 纯函数，确定性漂移计算
// ============================================================

import type { QuestionStyle, PlayerActionLog, NpcId } from "./types";

/** 提问方式 → 漂移增量 */
const QUESTION_DRIFT_MAP: Record<QuestionStyle, number> = {
  confirm: 3,
  press: 10,
  empathize: 5,
  silent_observe: 0,
  present_evidence: 6,
};

/** 根据提问方式计算漂移增量 */
export function calculateQuestionDrift(questionStyle: QuestionStyle): number {
  return QUESTION_DRIFT_MAP[questionStyle] ?? 0;
}

/** 计算重复提问惩罚 — 同一 (npcId, questionId) 每重复一次 +4 */
export function calculateRepeatPenalty(
  actionLogs: PlayerActionLog[],
  npcId: NpcId,
  questionId: string,
): number {
  const askLogs = actionLogs.filter(
    (log) =>
      log.actionType === "ask_npc" &&
      log.detail.includes(npcId) &&
      log.detail.includes(questionId),
  );
  // 当前这次不算，只算之前的重复次数
  const repeats = Math.max(0, askLogs.length);
  return repeats * 4;
}

/** 计算当前轮次基础漂移 */
function calculateRoundDrift(round: number): number {
  return round * 5;
}

/** 计算当前综合漂移值 */
export function calculateCurrentDriftLevel(params: {
  questionStyle: QuestionStyle;
  currentRound: number;
  baseDriftLevel: number;
  actionLogs: PlayerActionLog[];
  npcId: NpcId;
  questionId: string;
}): number {
  const questionDrift = calculateQuestionDrift(params.questionStyle);
  const roundDrift = calculateRoundDrift(params.currentRound);
  const repeatPenalty = calculateRepeatPenalty(
    params.actionLogs,
    params.npcId,
    params.questionId,
  );

  return Math.min(100, params.baseDriftLevel + questionDrift + roundDrift + repeatPenalty);
}

/** 熵值标签 */
export type EntropyLabel = "stable" | "unstable" | "critical";

/** 根据熵值返回标签 */
export function getEntropyLabel(entropy: number): EntropyLabel {
  if (entropy < 30) return "stable";
  if (entropy < 60) return "unstable";
  return "critical";
}
