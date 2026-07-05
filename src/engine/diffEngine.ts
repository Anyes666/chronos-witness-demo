// ============================================================
// diffEngine.ts — 证词对照板数据生成
// 基于手写 changedTokens/newTokens/omittedTokens 标记
// 不做 NLP，直接聚合 testimomyShells 中已标记的元数据
// ============================================================

import type { NpcId, TestimonyShell, TestimonyRecord, PlayerMark } from "./types";
import { DEMO_TESTIMONY_SHELLS } from "../data/cases/demo_shm_001/testimonyShells";

// ---- 对照板行数据 ----

export interface TestimonyBoardRow {
  npcId: NpcId;
  npcName: string;
  round: number;
  shellId: string;
  summary: string;
  fullText: string;
  stableFactIds: string[];
  changedTokens: string[];
  newTokens: string[];
  omittedTokens: string[];
  emotion: string;
  driftLevel: number;
  playerMarks: PlayerMark[];
}

// ---- NPC 对比结果 ----

export interface NpcComparison {
  npcId: NpcId;
  rounds: TestimonyBoardRow[];
  /** 该 NPC 在所有轮次的稳定事实（去重） */
  uniqueStableFacts: string[];
  /** 跨轮次变化的 token */
  allChangedTokens: string[];
  /** 跨轮次新增的 token */
  allNewTokens: string[];
}

// ---- 稳定事实覆盖情况 ----

export interface StableFactCoverage {
  stableFactId: string;
  content: string;
  npcId: NpcId;
  /** 有多少轮出现过 */
  roundCount: number;
  /** 出现的轮次列表 */
  rounds: number[];
}

// ---- 辅助函数 ----

/** 根据 NPC ID 获取中文名 */
function getNpcName(npcId: NpcId): string {
  const map: Record<NpcId, string> = {
    lin_xu: "林叙",
    lao_he: "老何",
    doctor_lu: "陆医生",
  };
  return map[npcId];
}

/** 找出某证词 Shell 上的玩家标记 */
function getMarksForShell(
  shellId: string,
  playerMarks: PlayerMark[],
): PlayerMark[] {
  return playerMarks.filter((m) => m.testimonyShellId === shellId);
}

// ---- 核心导出 ----

/** 根据证词历史生成对照板行数据 */
export function generateTestimonyBoard(
  testimonyHistory: TestimonyRecord[],
  playerMarks: PlayerMark[] = [],
): TestimonyBoardRow[] {
  const rows: TestimonyBoardRow[] = [];

  for (const record of testimonyHistory) {
    const shell = DEMO_TESTIMONY_SHELLS.find((s) => s.id === record.shellId);
    if (!shell) continue;

    rows.push({
      npcId: shell.npcId,
      npcName: getNpcName(shell.npcId),
      round: shell.round,
      shellId: shell.id,
      summary: shell.summary,
      fullText: shell.fullText,
      stableFactIds: shell.stableFactIds,
      changedTokens: shell.changedTokens,
      newTokens: shell.newTokens,
      omittedTokens: shell.omittedTokens,
      emotion: shell.emotion,
      driftLevel: record.driftLevel,
      playerMarks: getMarksForShell(shell.id, playerMarks),
    });
  }

  return rows;
}

/** 获取某 NPC 的跨轮次对比 */
export function getNpcRoundComparison(
  npcId: NpcId,
  testimonyHistory: TestimonyRecord[],
): NpcComparison {
  const shells = DEMO_TESTIMONY_SHELLS.filter((s) => s.npcId === npcId).sort(
    (a, b) => a.round - b.round,
  );

  const rows: TestimonyBoardRow[] = [];
  const uniqueStableFacts = new Set<string>();
  const allChangedTokens: string[] = [];
  const allNewTokens: string[] = [];

  for (const shell of shells) {
    // 检查该 shell 是否已经被询问过
    const record = testimonyHistory.find((r) => r.shellId === shell.id);
    const driftLevel = record?.driftLevel ?? shell.driftLevel;

    for (const fid of shell.stableFactIds) uniqueStableFacts.add(fid);
    for (const t of shell.changedTokens) allChangedTokens.push(t);
    for (const t of shell.newTokens) allNewTokens.push(t);

    rows.push({
      npcId: shell.npcId,
      npcName: getNpcName(shell.npcId),
      round: shell.round,
      shellId: shell.id,
      summary: shell.summary,
      fullText: shell.fullText,
      stableFactIds: shell.stableFactIds,
      changedTokens: shell.changedTokens,
      newTokens: shell.newTokens,
      omittedTokens: shell.omittedTokens,
      emotion: shell.emotion,
      driftLevel,
      playerMarks: [],
    });
  }

  return {
    npcId,
    rounds: rows,
    uniqueStableFacts: [...uniqueStableFacts],
    allChangedTokens: [...new Set(allChangedTokens)],
    allNewTokens: [...new Set(allNewTokens)],
  };
}

/** 统计稳定事实在某 NPC 的覆盖情况 */
export function getStableFactCoverage(
  testimonyHistory: TestimonyRecord[],
): StableFactCoverage[] {
  const npcStableFactMap = new Map<string, TestimonyShell[]>();

  // 从已询问的证词中找出关联的 shell
  for (const record of testimonyHistory) {
    const shell = DEMO_TESTIMONY_SHELLS.find((s) => s.id === record.shellId);
    if (!shell) continue;

    for (const factId of shell.stableFactIds) {
      const existing = npcStableFactMap.get(factId) ?? [];
      existing.push(shell);
      npcStableFactMap.set(factId, existing);
    }
  }

  const result: StableFactCoverage[] = [];

  for (const [factId, shells] of npcStableFactMap) {
    // 找出该稳定事实首次出现的位置，获取 content
    const firstShell = shells[0];
    const rounds = [...new Set(shells.map((s) => s.round))].sort();

    result.push({
      stableFactId: factId,
      content: `[${getNpcName(firstShell.npcId)}] ${firstShell.stableFactIds.join(", ")}`,
      npcId: firstShell.npcId,
      roundCount: rounds.length,
      rounds,
    });
  }

  return result;
}
