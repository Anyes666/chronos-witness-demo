import type { EvidenceId, GameSaveData, NpcId, RoundIndex } from "./types";
import { DEMO_EVIDENCE } from "../data/cases/demo_shm_001/evidence";
import { DEMO_NPCS } from "../data/cases/demo_shm_001/witnesses";
import { generateTestimonyBoard, getStableFactCoverage } from "./diffEngine";

export type ClueEntryType =
  | "evidence"
  | "stable_fact"
  | "conflict"
  | "system_note";

export interface ClueEntry {
  id: string;
  type: ClueEntryType;
  title: string;
  summary: string;
  detail: string;
  importance: "low" | "medium" | "high" | "critical";
  relatedEvidenceIds?: EvidenceId[];
  relatedNpcIds?: NpcId[];
  relatedRound?: RoundIndex;
  discovered: boolean;
}

const HIGH_VALUE_EVIDENCE = new Set<EvidenceId>([
  "E2_MEMORY_READER",
  "E3_LIGHT_LOG",
  "E6_EXECUTION_ORDER",
]);

function npcName(npcId: NpcId): string {
  return DEMO_NPCS.find((npc) => npc.id === npcId)?.name ?? npcId;
}

function evidenceImportance(evidenceId: EvidenceId): ClueEntry["importance"] {
  if (evidenceId === "E2_MEMORY_READER" || evidenceId === "E3_LIGHT_LOG") return "critical";
  if (HIGH_VALUE_EVIDENCE.has(evidenceId)) return "high";
  return "medium";
}

function evidenceSummary(evidenceId: EvidenceId): string {
  if (evidenceId === "E2_MEMORY_READER") {
    return "读取器存在异常损坏痕迹，官方自诱导结论开始不稳。";
  }
  if (evidenceId === "E3_LIGHT_LOG") {
    return "23:17 的中断记录可以和多名证词互相验证。";
  }
  if (evidenceId === "E1_WALL_SCRATCHES") {
    return "七道划痕与重复回溯存在数量对应关系。";
  }
  if (evidenceId === "E6_EXECUTION_ORDER") {
    return "执行令碎片显示案件背后存在程序化处置。";
  }
  return "这条物证可用于补足证据链。";
}

export function generateClueJournal(state: GameSaveData): ClueEntry[] {
  const entries: ClueEntry[] = [];
  const discoveredEvidence = new Set(state.discoveredEvidenceIds);

  for (const evidence of DEMO_EVIDENCE) {
    if (!discoveredEvidence.has(evidence.id)) continue;
    entries.push({
      id: `evidence_${evidence.id}`,
      type: "evidence",
      title: evidence.name,
      summary: evidenceSummary(evidence.id),
      detail: evidence.roundDescriptions[state.currentRound] ?? evidence.kernelDescription,
      importance: evidenceImportance(evidence.id),
      relatedEvidenceIds: [evidence.id],
      discovered: true,
    });
  }

  for (const coverage of getStableFactCoverage(state.testimonyHistory)) {
    entries.push({
      id: `stable_${coverage.stableFactId}`,
      type: "stable_fact",
      title: `稳定事实：${coverage.stableFactId}`,
      summary: `${npcName(coverage.npcId)} 的证词中反复出现同一锚点。`,
      detail: `已在第 ${coverage.rounds.join(", ")} 轮出现。先相信没有改变的信息，再判断变化的方向。`,
      importance: coverage.roundCount >= 2 ? "high" : "medium",
      relatedNpcIds: [coverage.npcId],
      relatedRound: coverage.rounds[0] as RoundIndex,
      discovered: true,
    });
  }

  const board = generateTestimonyBoard(state.testimonyHistory);
  for (const row of board) {
    const hasConflict =
      row.changedTokens.length > 0 ||
      row.newTokens.length > 0 ||
      row.omittedTokens.length > 0;
    if (!hasConflict) continue;

    entries.push({
      id: `conflict_${row.shellId}`,
      type: "conflict",
      title: `${row.npcName} 的证词漂移`,
      summary: "这条证词出现变化，适合放到对照板里比较。",
      detail: [
        row.changedTokens.length > 0 ? `变化：${row.changedTokens.join("、")}` : "",
        row.newTokens.length > 0 ? `新增：${row.newTokens.join("、")}` : "",
        row.omittedTokens.length > 0 ? `消失：${row.omittedTokens.join("、")}` : "",
      ].filter(Boolean).join("；"),
      importance: row.npcId === "lin_xu" && row.round >= 2 ? "high" : "medium",
      relatedNpcIds: [row.npcId],
      relatedRound: row.round as RoundIndex,
      discovered: true,
    });
  }

  if (entries.length === 0) {
    entries.push({
      id: "system_start",
      type: "system_note",
      title: "尚无可记录线索",
      summary: "先调查现场或询问证人，日志会记录可比对的信息。",
      detail: "线索日志只整理你已经发现的信息，不会直接给出完整真相。",
      importance: "low",
      discovered: false,
    });
  }

  return entries;
}

export function getCriticalClues(state: GameSaveData): ClueEntry[] {
  return generateClueJournal(state).filter(
    (entry) => entry.importance === "critical" || entry.importance === "high",
  );
}

export function getStableFactNotes(state: GameSaveData): ClueEntry[] {
  return generateClueJournal(state).filter((entry) => entry.type === "stable_fact");
}

export function getClueJournalSummary(state: GameSaveData): {
  evidenceCount: number;
  stableFactCount: number;
  conflictCount: number;
  criticalCount: number;
} {
  const journal = generateClueJournal(state);
  return {
    evidenceCount: journal.filter((entry) => entry.type === "evidence").length,
    stableFactCount: journal.filter((entry) => entry.type === "stable_fact").length,
    conflictCount: journal.filter((entry) => entry.type === "conflict").length,
    criticalCount: journal.filter(
      (entry) => entry.importance === "critical" || entry.importance === "high",
    ).length,
  };
}
