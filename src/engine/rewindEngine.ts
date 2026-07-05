// ============================================================
// rewindEngine.ts — 回溯系统
// 纯函数，管理 0-3 轮回溯状态机
// ============================================================

import type { RoundIndex, GameSaveData, PlayerActionLog } from "./types";

/** 最大回溯次数 */
const MAX_REWINDS = 3;

/** 单次回溯熵值增量 */
const REWIND_ENTROPY_INCREMENT = 15;

/** 检查当前轮次是否可以回溯 */
export function canRewind(currentRound: RoundIndex): boolean {
  return currentRound < MAX_REWINDS;
}

/** 获取下一轮回溯后的轮次，null 表示不可回溯 */
export function getNextRound(currentRound: RoundIndex): RoundIndex | null {
  if (!canRewind(currentRound)) return null;
  return (currentRound + 1) as RoundIndex;
}

/** 执行回溯：推进轮次、增加熵值、追加日志 */
export function performRewind(state: GameSaveData): GameSaveData {
  if (!canRewind(state.currentRound)) {
    throw new Error(
      `Cannot rewind: already at round ${state.currentRound} (max ${MAX_REWINDS})`,
    );
  }

  const nextRound = (state.currentRound + 1) as RoundIndex;
  const newEntropy = state.entropy + REWIND_ENTROPY_INCREMENT;

  const rewindLog: PlayerActionLog = {
    timestamp: new Date().toISOString(),
    round: state.currentRound,
    actionType: "rewind",
    detail: `Rewind from round ${state.currentRound} to round ${nextRound}. Entropy: ${state.entropy} → ${newEntropy}`,
  };

  return {
    ...state,
    currentRound: nextRound,
    entropy: newEntropy,
    actionLogs: [...state.actionLogs, rewindLog],
    savedAt: new Date().toISOString(),
  };
}

/** 获取剩余回溯次数 */
export function getRemainingRewinds(currentRound: RoundIndex): number {
  return Math.max(0, MAX_REWINDS - currentRound);
}
