// ============================================================
// accusationEngine.ts — 指控判定系统
// 处理两步指控 → 判定结局
// ============================================================

import type {
  GameSaveData,
  AccusationResult,
  EndingId,
  PlayerActionLog,
  EvidenceId,
} from "./types";
import { hasKeyEvidence } from "./evidenceEngine";

// ---- 参数类型 ----

export interface AccusationParams {
  /** 谁造成死亡（指控选项 ID） */
  whoCausedDeath: string;
  /** 固定哪个版本为真相 */
  whichVersionToFix: string;
  /** 玩家理由（可选） */
  reasonText?: string;
}

// ---- 证据覆盖等级 ----

export type EvidenceCoverage = "low" | "medium" | "high";

/** 关键物证组合 */
const KEY_EVIDENCE_SET: EvidenceId[] = [
  "E1_WALL_SCRATCHES",
  "E2_MEMORY_READER",
  "E3_LIGHT_LOG",
];

const MEDIUM_EVIDENCE_SET: EvidenceId[] = [
  "E2_MEMORY_READER",
  "E3_LIGHT_LOG",
];

/** 评估证据覆盖等级 */
export function evaluateEvidenceCoverage(state: GameSaveData): EvidenceCoverage {
  if (hasKeyEvidence(state, KEY_EVIDENCE_SET)) return "high";
  if (hasKeyEvidence(state, MEDIUM_EVIDENCE_SET)) return "medium";
  return "low";
}

/** 是否发现了排除自诱导的关键证据 E2 */
export function hasDisprovenSuicide(state: GameSaveData): boolean {
  return state.discoveredEvidenceIds.includes("E2_MEMORY_READER");
}

/** 是否询问过林叙至少 2 轮 */
export function hasInterviewedLinXuDeeply(state: GameSaveData): boolean {
  const linXuTestimonies = state.testimonyHistory.filter(
    (t) => t.npcId === "lin_xu",
  );
  return linXuTestimonies.length >= 2;
}

/** 判定结局 ID */
export function determineEnding(
  params: AccusationParams,
  _state: GameSaveData,
): EndingId {
  const { whichVersionToFix } = params;

  // 服从结案：选择官方自诱导版本 或 证据不足仍暂缓归档
  if (
    whichVersionToFix === "official_self_induced" ||
    whichVersionToFix === "suspend_archive"
  ) {
    return "obey_closure";
  }

  // 拒绝结案：强制回溯、拒绝固定
  return "refuse_closure";
}

/** 提交最终指控，返回更新状态和指控结果 */
export function submitAccusation(
  params: AccusationParams,
  state: GameSaveData,
): { state: GameSaveData; result: AccusationResult } {
  const endingId = determineEnding(params, state);

  const result: AccusationResult = {
    whoCausedDeath: params.whoCausedDeath,
    whichVersionToFix: params.whichVersionToFix,
    endingId,
  };

  const actionLog: PlayerActionLog = {
    timestamp: new Date().toISOString(),
    round: state.currentRound,
    actionType: "accuse",
    detail: JSON.stringify({
      whoCausedDeath: params.whoCausedDeath,
      whichVersionToFix: params.whichVersionToFix,
      endingId,
      reasonText: params.reasonText ?? "",
    }),
  };

  const newState: GameSaveData = {
    ...state,
    endingId,
    actionLogs: [...state.actionLogs, actionLog],
    savedAt: new Date().toISOString(),
  };

  return { state: newState, result };
}
