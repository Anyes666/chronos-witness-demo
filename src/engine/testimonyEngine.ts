// ============================================================
// testimonyEngine.ts — 证词系统
// 根据 NPC + 轮次 + 提问方式返回证词
// ============================================================

import type {
  NpcId,
  RoundIndex,
  QuestionStyle,
  TestimonyShell,
  TestimonyRecord,
  GameSaveData,
  PlayerActionLog,
  EvidenceId,
} from "./types";
import { DEMO_TESTIMONY_SHELLS } from "../data/cases/demo_shm_001/testimonyShells";
import { calculateCurrentDriftLevel } from "./driftEngine";

/** 根据 NPC 和轮次获取证词 Shell */
export function getTestimonyShell(
  npcId: NpcId,
  round: RoundIndex,
): TestimonyShell | undefined {
  return DEMO_TESTIMONY_SHELLS.find(
    (shell) => shell.npcId === npcId && shell.round === round,
  );
}

/** 获取某 NPC 在所有轮次中的证词 */
export function getNpcAllShells(npcId: NpcId): TestimonyShell[] {
  return DEMO_TESTIMONY_SHELLS.filter((shell) => shell.npcId === npcId).sort(
    (a, b) => a.round - b.round,
  );
}

/** askNpc 参数 */
export interface AskNpcParams {
  npcId: NpcId;
  questionId: string;
  questionText?: string;
  questionStyle: QuestionStyle;
  evidenceId?: string;
}

/** 询问 NPC 并返回证词记录 + 更新状态 */
export function askNpc(
  params: AskNpcParams,
  state: GameSaveData,
): { state: GameSaveData; testimony: TestimonyRecord } {
  const shell = getTestimonyShell(params.npcId, state.currentRound);

  if (!shell) {
    throw new Error(
      `No testimony found for NPC "${params.npcId}" at round ${state.currentRound}`,
    );
  }

  // 计算本次提问的漂移等级
  const driftLevel = calculateCurrentDriftLevel({
    questionStyle: params.questionStyle,
    currentRound: state.currentRound,
    baseDriftLevel: shell.driftLevel,
    actionLogs: state.actionLogs,
    npcId: params.npcId,
    questionId: params.questionId,
  });

  const testimony: TestimonyRecord = {
    shellId: shell.id,
    npcId: params.npcId,
    round: state.currentRound,
    questionStyle: params.questionStyle,
    evidenceId: params.evidenceId as EvidenceId | undefined,
    fullText: shell.fullText,
    emotion: shell.emotion,
    driftLevel,
  };

  const actionLog: PlayerActionLog = {
    timestamp: new Date().toISOString(),
    round: state.currentRound,
    actionType: "ask_npc",
    detail: JSON.stringify({
      npcId: params.npcId,
      questionId: params.questionId,
      questionStyle: params.questionStyle,
      shellId: shell.id,
      driftLevel,
    }),
  };

  const newState: GameSaveData = {
    ...state,
    testimonyHistory: [...state.testimonyHistory, testimony],
    actionLogs: [...state.actionLogs, actionLog],
    entropy: state.entropy + (params.questionStyle === "silent_observe" ? 0 : 2),
    savedAt: new Date().toISOString(),
  };

  return { state: newState, testimony };
}
