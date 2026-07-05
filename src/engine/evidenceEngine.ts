// ============================================================
// evidenceEngine.ts — 证据系统
// 地点调查、物证发现、按轮次获取描述
// ============================================================

import type {
  Evidence,
  EvidenceId,
  RoundIndex,
  GameSaveData,
  PlayerActionLog,
} from "./types";
import { DEMO_EVIDENCE } from "../data/cases/demo_shm_001/evidence";
import { DEMO_LOCATIONS } from "../data/cases/demo_shm_001/scene";

/** 根据 locationId 返回该地点可调查的物证列表 */
export function inspectLocation(locationId: string): Evidence[] {
  const location = DEMO_LOCATIONS.find((loc) => loc.id === locationId);
  if (!location) return [];

  return DEMO_EVIDENCE.filter((ev) => location.evidenceIds.includes(ev.id));
}

/** 根据 evidenceId 获取物证 */
export function getEvidenceById(evidenceId: EvidenceId): Evidence | undefined {
  return DEMO_EVIDENCE.find((ev) => ev.id === evidenceId);
}

/** 根据当前轮次获取物证描述 */
export function getEvidenceDescription(
  evidenceId: EvidenceId,
  round: RoundIndex,
): string {
  const evidence = getEvidenceById(evidenceId);
  if (!evidence) {
    throw new Error(`Evidence not found: ${evidenceId}`);
  }
  return evidence.roundDescriptions[round] ?? evidence.kernelDescription;
}

/** 发现物证，返回更新后的状态 */
export function discoverEvidence(
  state: GameSaveData,
  evidenceId: EvidenceId,
): GameSaveData {
  const evidence = getEvidenceById(evidenceId);
  if (!evidence) {
    throw new Error(`Evidence not found: ${evidenceId}`);
  }

  // 已发现的不重复加入
  if (state.discoveredEvidenceIds.includes(evidenceId)) {
    // 但仍然记录调查行为
    const log: PlayerActionLog = {
      timestamp: new Date().toISOString(),
      round: state.currentRound,
      actionType: "discover_evidence",
      detail: `Re-examined evidence: ${evidenceId} (${evidence.name})`,
    };
    return {
      ...state,
      actionLogs: [...state.actionLogs, log],
      savedAt: new Date().toISOString(),
    };
  }

  const log: PlayerActionLog = {
    timestamp: new Date().toISOString(),
    round: state.currentRound,
    actionType: "discover_evidence",
    detail: `Discovered evidence: ${evidenceId} (${evidence.name})`,
  };

  return {
    ...state,
    discoveredEvidenceIds: [...state.discoveredEvidenceIds, evidenceId],
    actionLogs: [...state.actionLogs, log],
    savedAt: new Date().toISOString(),
  };
}

/** 获取所有已发现物证的证据覆盖情况 */
export function getEvidenceCoverage(
  state: GameSaveData,
): { total: number; discovered: number; percentage: number } {
  const total = DEMO_EVIDENCE.length;
  const discovered = state.discoveredEvidenceIds.length;
  return {
    total,
    discovered,
    percentage: total > 0 ? Math.round((discovered / total) * 100) : 0,
  };
}

/** 检查是否发现了特定的关键物证组合 */
export function hasKeyEvidence(
  state: GameSaveData,
  evidenceIds: EvidenceId[],
): boolean {
  return evidenceIds.every((id) => state.discoveredEvidenceIds.includes(id));
}
